// PNG export functionality

async function loadImage(src) {
  // For data URLs, load directly
  if (src.startsWith("data:")) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load data URL"));
      img.src = src;
    });
  }
  // For file URLs, fetch as blob to avoid tainted canvas
  const response = await fetch(src);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load: " + src));
    };
    img.src = url;
  });
}

function svgToDataUrl(svgEl) {
  const clone = svgEl.cloneNode(true);
  clone.setAttribute("width", 200);
  clone.setAttribute("height", 240);
  const data = new XMLSerializer().serializeToString(clone);
  return (
    "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(data)))
  );
}

async function savePNG() {
  try {
    const svg = heraldry.querySelector("svg");
    if (!svg) return;

    const scale = 4;
    const width = 200;
    const height = 240;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);

    // Get image elements and their attributes before removing
    const imageEls = svg.querySelectorAll("image");
    const imageData = Array.from(imageEls).map((img) => ({
      href: img.getAttribute("href"),
      x: parseFloat(img.getAttribute("x")),
      y: parseFloat(img.getAttribute("y")),
      width: parseFloat(img.getAttribute("width")),
      height: parseFloat(img.getAttribute("height")),
      filter: img.getAttribute("filter"),
    }));

    // Create SVG without images for base rendering
    const svgClone = svg.cloneNode(true);
    svgClone.querySelectorAll("image").forEach((img) => img.remove());

    // Draw base shield
    const baseImg = await loadImage(svgToDataUrl(svgClone));
    ctx.drawImage(baseImg, 0, 0, width, height);

    // Create clipping path matching the shield
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(200, 0);
    ctx.lineTo(200, 110);
    ctx.bezierCurveTo(200, 180, 160, 230, 100, 240);
    ctx.bezierCurveTo(40, 230, 0, 180, 0, 110);
    ctx.closePath();
    ctx.clip();

    // Draw each device image
    for (const data of imageData) {
      if (!data.href) continue;
      try {
        const deviceImg = await loadImage(data.href);

        // Apply color filter by drawing to temp canvas
        if (data.filter) {
          const match = data.filter.match(/url\(#dev-([a-fA-F0-9]+)\)/);
          if (match) {
            const color = "#" + match[1];
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = data.width * scale;
            tempCanvas.height = data.height * scale;
            const tempCtx = tempCanvas.getContext("2d");
            tempCtx.scale(scale, scale);

            if (color === "#000000") {
              // Black tincture: invert the image (black outline becomes white, white fill becomes black)
              tempCtx.drawImage(deviceImg, 0, 0, data.width, data.height);
              const imgData = tempCtx.getImageData(
                0,
                0,
                tempCanvas.width,
                tempCanvas.height,
              );
              const pixels = imgData.data;
              for (let i = 0; i < pixels.length; i += 4) {
                pixels[i] = 255 - pixels[i]; // R
                pixels[i + 1] = 255 - pixels[i + 1]; // G
                pixels[i + 2] = 255 - pixels[i + 2]; // B
                // Alpha stays the same
              }
              tempCtx.putImageData(imgData, 0, 0);
            } else {
              // Fill with tincture color first
              tempCtx.fillStyle = color;
              tempCtx.fillRect(0, 0, data.width, data.height);

              // Multiply blend: white becomes color, black stays black
              tempCtx.globalCompositeOperation = "multiply";
              tempCtx.drawImage(deviceImg, 0, 0, data.width, data.height);

              // Use original image alpha to mask out background
              tempCtx.globalCompositeOperation = "destination-in";
              tempCtx.drawImage(deviceImg, 0, 0, data.width, data.height);
            }

            ctx.drawImage(tempCanvas, data.x, data.y, data.width, data.height);
            continue;
          }
        }
        ctx.drawImage(deviceImg, data.x, data.y, data.width, data.height);
      } catch (e) {
        console.warn("Failed to load device image:", data.href, e);
      }
    }

    ctx.restore();

    // Redraw shield border on top
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(200, 0);
    ctx.lineTo(200, 110);
    ctx.bezierCurveTo(200, 180, 160, 230, 100, 240);
    ctx.bezierCurveTo(40, 230, 0, 180, 0, 110);
    ctx.closePath();
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.stroke();

    canvas.toBlob((blob) => {
      const link = document.createElement("a");
      link.download = "heraldry.png";
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }, "image/png");
  } catch (e) {
    console.error("Save PNG failed:", e);
    alert("Failed to save PNG: " + e.message);
  }
}
