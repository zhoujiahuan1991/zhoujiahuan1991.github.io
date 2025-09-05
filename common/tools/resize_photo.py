from PIL import Image

def resize_crop_or_pad(image_path,
                       output_path,
                       target_width,
                       target_height,
                       priority='height'):
    """
    缩放 + 裁剪/填充（填充颜色取自左上角像素）
    """
    img = Image.open(image_path)
    orig_w, orig_h = img.size

    # ① 计算缩放后的尺寸
    if priority == 'height':              # 先满足高度
        new_h = target_height
        new_w = int(orig_w * target_height / orig_h)
    elif priority == 'width':             # 先满足宽度
        new_w = target_width
        new_h = int(orig_h * target_width / orig_w)
    else:
        raise ValueError("priority must be either 'height' or 'width'")

    img_resized = img.resize((new_w, new_h), Image.LANCZOS)

    # ② 背景颜色：左上角像素
    bg_color = img_resized.getpixel((0, 0))

    # ③ 根据缩放结果裁剪或填充
    if new_w >= target_width and new_h >= target_height:
        # ——— 两边都够大：居中裁剪 ———
        left   = (new_w - target_width)  // 2
        top    = (new_h - target_height) // 2
        right  = left + target_width
        bottom = top  + target_height
        img_out = img_resized.crop((left, top, right, bottom))
    else:
        # ——— 有一边不足：新建画布 + 居中填充 ———
        img_out = Image.new(img.mode, (target_width, target_height), bg_color)
        offset_x = (target_width  - new_w) // 2
        offset_y = (target_height - new_h) // 2
        img_out.paste(img_resized, (offset_x, 2*offset_y))

    img_out.save(output_path)


# ========= 使用示例 =========
image_path  = 'common/img/hyc.jpg'
output_path = image_path.replace('.jpg', '-resized.jpg')
resize_crop_or_pad(image_path,
                   output_path,
                   target_width=300,
                   target_height=400,
                   priority='height')

# resize_crop_or_pad(image_path,
#                    output_path,
#                    target_width=400,
#                    target_height=300,
#                    priority='width')
