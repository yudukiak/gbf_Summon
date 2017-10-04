<#
.SYNOPSIS
 Return Draw Object

.PARAMETER File
  Imagefile path

.NOTE
  @see https://github.com/miyamiya/mypss/blob/master/README.md
  @author miyamiya <rai.caver@gmail.com>

.EXAMPLE
  ### Example: resize & rotate image

  # Get object
  $draw = Get-Draw -File 'C:\hoge.jpg'

  # Resize
  $draw.resize.Invoke('30%')

  # Rotate (right-hand turn)
  $draw.rotate.Invoke(90)

  # Save
  $draw.save.Invoke('C:\hoge-resize.png')

  # Object dispse
  $draw.dispose.Invoke()

#>
function Global:Get-Draw{
    Param(
        [CmdletBinding()]
        [Parameter()]
        [ValidateScript({Test-Path -LiteralPath $_ -PathType Leaf})]
        [String]$File
    )
    # Load Assembly
    [void][Reflection.Assembly]::LoadWithPartialName('System.Drawing')

    # Load Image
    $image = New-Object System.Drawing.Bitmap([string](Resolve-Path $File | Select-Object $_.Path))

    # Context Object
    $context = @{basefile=$File; rotate='NONE'; flip='NONE'; mode='NearestNeighbor'}

    # Draw Object
    $draw = @{}
    $draw.Set_Item('rotate', (Rotate-MypssDraw  -Context $context))
    $draw.Set_Item('flip',   (Flip-MypssDraw    -Context $context))
    $draw.Set_Item('resize', (Resize-MypssDraw  -Image $image -Context $context))
    $draw.Set_Item('format', (Format-MypssDraw  -Context $context))
    $draw.Set_Item('mode',   (Mode-MypssDraw    -Context $context))
    $draw.Set_Item('save',   (Save-MypssDraw    -Image $image -Context $context))
    $draw.Set_Item('dispose',(Dispose-MypssDraw -Image $image -Context $context))
    $draw.Set_Item('debug',  (Debug-MypssDraw   -Image $image -Context $context))
    return $draw
}

function Global:Rotate-MypssDraw
{
    Param(
        [CmdletBinding()]
        [Parameter()]
        [Object]$Context
    )
    return {
        param(
            [Parameter()]
            [ValidateSet('NONE', '90', '180', '270')]
            [string]$Rotate
        )
        $Context.Set_Item('rotate', $Rotate)
    }.GetNewClosure()
}

function Global:Flip-MypssDraw
{
    Param(
        [CmdletBinding()]
        [Parameter()]
        [Object]$Context
    )
    return {
        param(
            [Parameter()]
            [ValidateSet('NONE', 'X', 'Y', 'XY')]
            [string]$Flip
        )
        $Context.Set_Item('flip', $Flip)
    }.GetNewClosure()
}

function Global:Resize-MypssDraw
{
    Param(
        [CmdletBinding()]
        [Parameter()]
        [Object]$Image,
        [Parameter()]
        [Object]$Context
    )
    return {
        Param(
            [CmdletBinding()]
            [Parameter()]
            [ValidatePattern('^\d*[%]?$')]
            [string]$ToX,
            [Parameter()]
            [ValidatePattern('^\d*[%]?$')]
            [string]$ToY
        )

        $calc = {
            Param(
                [int]$baseSize,
                [string]$ToSize
            )
            if(!([string]::IsNullOrEmpty($ToSize)) -And $ToSize -match '^\d*$') {
                return ([int]$ToSize / $baseSize)
            }
            # Parsent
            if(!([string]::IsNullOrEmpty($ToSize)) -And $ToSize -match '^(\d*)[%]?$') {
                return ([int]$Matches[1] / 100)
            }
            return 1
        }

        $ratioX = ($calc.Invoke($Image.Width,  $ToX)).ToDouble($null)
        $ratioY = ($calc.Invoke($Image.Height, $ToY)).ToDouble($null)
        if ([string]::IsNullOrEmpty($ToX) -And !([string]::IsNullOrEmpty($ToY))) {
            $ratioX = $ratioY
        }
        if ([string]::IsNullOrEmpty($ToY) -And !([string]::IsNullOrEmpty($ToX))) {
            $ratioY = $ratioX
        }
        $Context.Set_Item('ratioX', $ratioX)
        $Context.Set_Item('ratioY', $ratioY)
    }.GetNewClosure()
}

function Global:Format-MypssDraw
{
    Param(
        [CmdletBinding()]
        [Parameter()]
        [Object]$Context
    )
    return {
        param(
            [Parameter()]
            [string]$FormatOrFilepath
        )
        $list = @{
            'bmp' ='Bmp'; 'emf' ='Emf'; 'exif'='Exif';
            'gif' ='Gif'; 'ico' ='Icon'; 'jpg' ='Jpeg';
            'jpeg'='Jpeg'; 'png' ='Png'; 'tiff'='Tiff';
            'wmf'='Wmf'
        }
        if($FormatOrFilepath -match '.*\.([a-zA-Z]+)$') {
            $ext = $list.($Matches[1])
            if(!([string]::IsNullOrEmpty($ext))) {
                $Context.Set_Item('format', $ext)
                return
            }
        }

        $ext = $list.$FormatOrFilepath
        if(!([string]::IsNullOrEmpty($ext))) {
            $Context.Set_Item('format', $ext)
            return
        }

        $Context.Set_Item('format', 'Bmp')
    }.GetNewClosure()
}

function Global:Mode-MypssDraw
{
    Param(
        [CmdletBinding()]
        [Parameter()]
        [Object]$Context
    )
    return {
        param(
            [Parameter()]
            [ValidateSet('Bicubic', 'Bilinear', 'Default', 'High', 'HighQualityBicubic', 'HighQualityBilinear', 'Low', 'NearestNeighbor')]
            [string]$Mode
        )
        $Context.Set_Item('mode', $Mode)
    }.GetNewClosure()
}

function Global:Save-MypssDraw
{
    Param(
        [CmdletBinding()]
        [Parameter()]
        [Object]$Image,
        [Parameter()]
        [Object]$Context
    )
    return {
        param(
            [String]$Outfile
        )
        # Outfile is empty
        if ([string]::IsNullOrEmpty($Outfile) -And $Context.basefile -match '^(.*)\.([a-zA-Z]+)$') {
           :filesearch for($i=1; $i -le 100; $i++) {
                $tmp = '{0}({1}).{2}' -F $Matches[1], $i, $Matches[2]
                if(!(Test-Path -LiteralPath $tmp -PathType Leaf)) {
                    $Outfile = $tmp
                    break filesearch
                }
            }
        }
        # Outfile Literal Path
        if (!(Split-Path $Outfile -IsAbsolute)) {
            $Outfile = ((Convert-Path .) + '\' + $Outfile)
        }
        # Make Output Directory
        if ($Outfile -And !(Test-Path -LiteralPath (Split-Path $Outfile -parent) -PathType container)) {
            [void](New-Item (Split-Path $Outfile -parent) -type container -Force)
        }

        # Make Canvas
        if([string]::IsNullOrEmpty($Context.ratioX) -Or [string]::IsNullOrEmpty($Context.ratioY)) {
            (Resize-MypssDraw $Image $Context).Invoke('100%')
        }
        $Canvas = New-Object System.Drawing.Bitmap([int]($Image.Width * $Context.ratioX), [int]($Image.Height * $Context.ratioY))
        $Graphics = [System.Drawing.Graphics]::FromImage($Canvas)

        # Mode
        $Graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::($Context.mode)

        # Resize
        $Graphics.DrawImage($Image, (New-Object System.Drawing.Rectangle(0, 0, $Canvas.Width, $Canvas.Height)))

        # Rotate
        $Canvas.RotateFlip(([System.String]::Format('Rotate{0}Flip{1}', $Context.rotate, $Context.flip)))

        # Check output format
        if ([string]::IsNullOrEmpty($Context.format)) {
            (Format-MypssDraw $Context).Invoke($Outfile)
        }

        # Save
        $Canvas.Save($Outfile, [System.Drawing.Imaging.ImageFormat]::($Context.format))
    }.GetNewClosure()
}

function Global:Dispose-MypssDraw
{
    Param(
        [CmdletBinding()]
        [Parameter()]
        [Object]$Image,
        [Parameter()]
        [Object]$Context
    )
    return {
        param()
        if($Image) { $Image.Dispose(); $Image = $null }
        if($Context) { $Context = $null }
    }.GetNewClosure()
}

function Global:Debug-MypssDraw
{
    Param(
        [CmdletBinding()]
        [Parameter()]
        [Object]$Image,
        [Parameter()]
        [Object]$Context
    )
    return {
        $Image.GetType()
        $Image | Format-List *

        $Context.GetType()
        $Context | Format-List *
    }.GetNewClosure()
}
