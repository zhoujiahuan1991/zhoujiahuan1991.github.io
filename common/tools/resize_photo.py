from PIL import Image

def resize_and_crop(image_path, output_path, target_width, target_height):
    img = Image.open(image_path)
    
    original_width, original_height = img.size
    
    new_width = target_width
    new_height = int(target_width * original_height / original_width)
    img_resized = img.resize((new_width, new_height))

    left = 0
    top = (new_height - target_height) // 2
    right = new_width
    bottom = top + target_height

    img_cropped = img_resized.crop((left, top, right, bottom))

    img_cropped.save(output_path)

image_path = 'common/img/lys.jpg' 
output_path = image_path.replace('.jpg', '-resized.jpg')
# output_path = image_path.replace('.png', '-resized.png')
# pattern for people images
target_width = 300  
target_height = 400
# patern for group images
# target_width = 400  
# target_height = 300 

resize_and_crop(image_path, output_path, target_width, target_height)
