/**
 * 根据字符串生成行列矩阵动画帧，实现字幕“从右往左滚动”
 * @param {string} text 要滚动的内容
 * @param {number} rows 行数
 * @param {number} cols 列数
 * @param {string} color 显示颜色
 * @param {string} bgColor 背景色
 * @param {number} fontSize 字号
 * @returns 帧数组（二维数组列表）
 */
function drawTextMatrix(text, rows, cols, color, bgColor, fontSize) {
  // 用 canvas 绘制文字成像素点阵，再映射到二维数组
  const canvas = document.createElement('canvas');
  canvas.width = cols * 8;
  canvas.height = rows * 8;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fontSize*8}px monospace`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';
  ctx.fillText(text, 0, 0);

  // 位图采样为点阵 0/1
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const frameCount = (canvas.width / cols) | 0;
  const frames = [];
  for (let shift = 0; shift <= canvas.width - cols; shift+=8) {
    // 生成每一帧
    const frame = Array.from({ length: rows }, (_, r) => Array(cols).fill(bgColor));
    for (let r = 0; r < rows; ++r) {
      for (let c = 0; c < cols; ++c) {
        let found = false;
        for (let dr = 0; dr < 8; ++dr) {
          for (let dc = 0; dc < 8; ++dc) {
            const x = shift + c*8 + dc;
            const y = r*8 + dr;
            const offset = (y * canvas.width + x) * 4;
            if (img.data[offset+3] > 128) {
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (found) frame[r][c] = color;
      }
    }
    frames.push(frame);
  }
  return frames;
}

export default drawTextMatrix;