from PIL import Image

def resize_and_crop(image_path, output_path, target_width, target_height, priority='height'):
    img = Image.open(image_path)
    original_width, original_height = img.size

    if priority == 'height':
        # 优先满足高度
        new_height = target_height
        new_width = int(target_height * original_width / original_height)
        img_resized = img.resize((new_width, new_height))

        # 居中裁剪宽度
        left = (new_width - target_width) // 2
        top = 0
        right = left + target_width
        bottom = new_height

    elif priority == 'width':
        # 优先满足宽度
        new_width = target_width
        new_height = int(target_width * original_height / original_width)
        img_resized = img.resize((new_width, new_height))

        # 居中裁剪高度
        left = 0
        top = (new_height - target_height) // 2
        right = new_width
        bottom = top + target_height

    else:
        raise ValueError("priority must be either 'height' or 'width'")

    img_cropped = img_resized.crop((left, top, right, bottom))
    img_cropped.save(output_path)


image_path = 'common/img/lqw.jpg' 
output_path = image_path.replace('.jpg', '-resized.jpg')
# output_path = image_path.replace('.png', '-resized.png')
# pattern for people images
target_width = 300  
target_height = 400
# patern for group images
# target_width = 400  
# target_height = 300 

resize_and_crop(image_path, output_path, target_width, target_height)
