# create tmp folder
New-Item tmp -itemType Directory -Force | Out-Null
echo "create /tmp directory"

# echo download
function echoDownload {
  $echoCli = New-Object System.Net.WebClient
  $echoUrl = "https://script.google.com/macros/s/AKfycbxo5Ny0LL8HcNvE4QH8NdrBwYQW8gsX3Nkpp-SHPshtyjqLP6U/exec"
  $echoUri = New-Object System.Uri($echoUrl)
  $echoFile = "echo"
  $echoCli.DownloadFile($echoUri, (Join-Path "tmp" $echoFile))
  # file size
  $echoSize = $(Get-ChildItem "tmp\echo").Length / 1KB
  if($echoSize -lt 1){
    echoDownload
    echo "retry download echo (${echoSize}KB)"
  } else {
    Move-Item "tmp\echo" "..\assets\" -Force
    echo "download echo (${echoSize}KB)"
  }
}
echoDownload

# echo
[string]$echoString = ""
$echo = "..\assets\echo"
$echoConvert = (Get-Content $echo -Encoding UTF8 | ConvertFrom-Json)
$echoNameLen = $echoConvert.name.Length
for($i=0;  $i -lt $echoNameLen; $i++){
  switch($echoConvert.class[$i]){
    "summon"{
      $echoString += $echoConvert.id[$i] + ".jpg`r`n"
      if($echoConvert.rank5[$i].Length -ne 0){
        $echoString += $echoConvert.id[$i] + "_02.jpg`r`n"
      }
    }
    "character"{
      $characterId = $echoConvert.id[$i]
      if ($characterId.Contains("_")) {
        $characterIdAry = $characterId -split "_"
        $echoString += $characterIdAry[0] + "_01_" + $characterIdAry[1] +".jpg`r`n"
        if($echoConvert.rarity[$i] -ne "skin"){
          $echoString += $characterIdAry[0] + "_02_" + $characterIdAry[1] +".jpg`r`n"
        }
        if($echoConvert.rank4[$i].Length -ne 0){
          $echoString += $characterIdAry[0] + "_03_" + $characterIdAry[1] +".jpg`r`n"
        }
      } else {
        $echoString += $characterId + "_01.jpg`r`n"
        if($echoConvert.rarity[$i] -ne "skin"){
          $echoString += $characterId + "_02.jpg`r`n"
        }
        if($echoConvert.rank4[$i].Length -ne 0){
          $echoString += $characterId + "_03.jpg`r`n"
        }
      }
    }
    "job"{
      $echoString += $echoConvert.id[$i] + "_0_01.png`r`n"
      $echoString += $echoConvert.id[$i] + "_1_01.png`r`n"
    }
  }
}
Out-File -InputObject $echoString -FilePath tmp\diff_echo.txt -Encoding UTF8 # temporary saving
$echoString = Get-Content tmp\diff_echo.txt | Sort-Object # sort text
$echoString = $echoString -replace " ", "`r`n"
Out-File -InputObject $echoString -FilePath tmp\diff_echo.txt -Encoding UTF8 # saving
echo "create diff_echo.txt"

# image
[string]$imageString = ""
$image = Get-ChildItem ("..\image\thumbnail")
$imageName = $image.name
Out-File -InputObject $imageName -FilePath tmp\diff_image.txt -Encoding UTF8 # temporary saving
$imageString = Get-Content tmp\diff_image.txt | Sort-Object # sort text
$imageString = $imageString -replace " ", "`r`n"
Out-File -InputObject $imageString -FilePath tmp\diff_image.txt -Encoding UTF8 # saving
echo "create diff_image.txt"

# diff, download, resize, move
# used "mypss" => https://github.com/miyamiya/mypss
& ("./Get-Draw.ps1")
[string]$diffString = ""
$diffEcho = Get-Content tmp\diff_echo.txt
$diffImage = Get-Content tmp\diff_image.txt
$diff = Compare-Object $diffEcho $diffImage
Out-File -InputObject $diff -FilePath tmp\diff_data.txt -Encoding UTF8
#$diff = $diff -replace "2030004000.jpg ", ""
#$diff = $diff -replace "2030014000.jpg ", ""
#$diff = $diff -replace "3020065000_02.jpg ", ""
#$diff = $diff -replace "3030158000_02.jpg ", ""
#$diff = $diff -replace "3040097000_02.jpg ", ""
#$diff = $diff -replace "2040020000_02.jpg ", ""
#$diff = $diff -replace "2040027000_02.jpg ", ""
#$diff = $diff -replace "2040028000_02.jpg ", ""
#$diff = $diff -replace "2040034000_02.jpg ", ""
#$diff = $diff -replace "2040046000_02.jpg ", ""
#$diff = $diff -replace "2040047000_02.jpg ", ""
#$diff = $diff -replace "empty.jpg", ""
#$diff = $diff -replace "tmp", ""
# download
function dlUrl($diffInputStr){
  switch -Regex ($diffInputStr){
    # 2040003000_02, 2040056000_02, 2040080000_02, 2040084000_02, 2040090000_02, 2040094000_02, 2040098000_02, 2040100000_02
    "2040(003|056|080|084|090|094|098|100)000_02.jpg" {return "http://game-a.granbluefantasy.jp/assets/img/sp/assets/summon/m/" + $diffInputStr}
    # character
    "_0[123].jpg"{return "http://game-a.granbluefantasy.jp/assets/img/sp/assets/npc/m/" + $diffInputStr}
    "_0[123]_0?[123456].jpg"{return "http://game-a.granbluefantasy.jp/assets/img/sp/assets/npc/m/" + $diffInputStr}
    # job
    "_01.png"{return "http://game-a.granbluefantasy.jp/assets/img/sp/assets/leader/talk/" + $diffInputStr}
    # summon
    default {return "http://game-a.granbluefantasy.jp/assets/img/sp/assets/summon/m/" + $diffInputStr}
  }
}
foreach($data in $diff) {
  if($data.SideIndicator -eq "<=") {
    $diffInput = $data.InputObject
    if ([string]::IsNullOrEmpty($diffInput)) {
      continue
    }
    $url = dlUrl $diffInput
    echo "[url] $($url)"
    $uri = New-Object System.Uri($url)
    $file = Split-Path $uri.AbsolutePath -Leaf
    $cli = New-Object System.Net.WebClient
    $cli.DownloadFile($uri, (Join-Path "tmp" $file))
    # resize
    $tmpDiffInput = "tmp\" + $diffInput
    $draw = Get-Draw -File $tmpDiffInput
    $draw.resize.Invoke(90, $null)
    $draw.mode.Invoke('HighQualityBicubic')
    $draw.save.Invoke($diffInput)
    $draw.dispose.Invoke() # Object dispse
    # move
    Move-Item $diffInput "tmp" -force
    Copy-Item $tmpDiffInput "..\image\thumbnail\"
    $diffString += $diffInput
  }
}
Out-File -InputObject $diffString -FilePath tmp\diff.txt -Encoding UTF8
echo "create diff.txt"
echo "<diff list>"
echo $diffString

function Pause() {
  Write-Host "Press any key to continue ..." -NoNewLine
  [Console]::ReadKey() | Out-Null
}
Pause

# remove tmp folder
Remove-Item -path tmp -Recurse -Force
