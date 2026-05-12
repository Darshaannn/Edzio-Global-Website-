Add-Type -AssemblyName System.Drawing
$images = @("WHy chosse us bg img (1).jpeg", "WHy chosse us bg img (2).jpeg", "WHy chosse us bg img (3).jpeg", "WHy chosse us bg img (4).jpeg")
foreach ($imgName in $images) {
    $inPath = "C:\Darshan\edzio3.0\assests\$imgName"
    $outName = $imgName -replace "\.jpeg$", "-opt.jpg"
    $outPath = "C:\Darshan\edzio3.0\assests\$outName"
    
    $img = [System.Drawing.Image]::FromFile($inPath)
    
    # Calculate new size (max width 600px while keeping aspect ratio)
    $ratio = 600 / $img.Width
    $newWidth = 600
    $newHeight = [math]::Round($img.Height * $ratio)
    
    $newSize = New-Object System.Drawing.Size($newWidth, $newHeight)
    $bmp = New-Object System.Drawing.Bitmap($img, $newSize)
    
    # Save as high quality JPEG
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    
    $img.Dispose()
    $bmp.Dispose()
    Write-Host "Optimized $imgName"
}
