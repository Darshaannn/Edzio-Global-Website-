Add-Type -AssemblyName System.Drawing

$inPath = "C:\Darshan\edzio3.0\assests\edzio logo.png"
$outPath = "C:\Darshan\edzio3.0\assests\edzio logo-opt.png"

$img = [System.Drawing.Image]::FromFile($inPath)

# Resize to max 300px wide while keeping aspect ratio
$maxWidth = 300
$ratio = $maxWidth / $img.Width
$newWidth = $maxWidth
$newHeight = [math]::Round($img.Height * $ratio)

$bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, 0, 0, $newWidth, $newHeight)
$g.Dispose()

$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$img.Dispose()
$bmp.Dispose()

$originalSize = (Get-Item $inPath).Length
$newSize = (Get-Item $outPath).Length
Write-Host "Original: $([math]::Round($originalSize/1KB)) KB"
Write-Host "Optimized: $([math]::Round($newSize/1KB)) KB"
Write-Host "Saved: $([math]::Round(($originalSize - $newSize)/1KB)) KB"
