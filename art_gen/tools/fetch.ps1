param([string]$Url="",[Parameter(Mandatory)][string]$Name,[int]$Expect=0,[int]$Colors=24,[int]$Floor=0,[int]$Canvas=0)
# Download a generated image into art_gen/out (when -Url is given) and run the Jacquin cleanup pipeline on it.
$py="$env:LOCALAPPDATA\Programs\Python\Python313\python.exe"
$root=Split-Path -Parent $PSScriptRoot
Set-Location $root
if($Url -ne ""){ Invoke-WebRequest $Url -OutFile "out\$Name.jpg" -UseBasicParsing }
$a=@("tools\clean.py","out\$Name.jpg","out\clean",$Name,"--colors",$Colors)
if($Expect -gt 0){$a+=@("--expect",$Expect)}
if($Floor -gt 0){$a+=@("--floor",$Floor)}
if($Canvas -gt 0){$a+=@("--canvas",$Canvas)}
& $py @a | Select-String 'low_contrast|WARN|rror|"colors"'
