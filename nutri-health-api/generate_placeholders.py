"""
Generate placeholder images and audio files for story content
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Colors for different stories
STORY_COLORS = {
    'story-1': {
        'cover': '#91f78e',  # primary_container (green)
        'pages': ['#dce6d4', '#ccd8c4', '#ebf3e3']  # surface variants
    },
    'story-2': {
        'cover': '#ffc897',  # secondary_container (orange)
        'pages': ['#ffe5d0', '#ffd4b3', '#fff0e3']  # surface variants
    }
}

def create_placeholder_image(width, height, color, text, output_path):
    """Create a placeholder image with text"""
    # Create image with background color
    img = Image.new('RGB', (width, height), color)
    draw = ImageDraw.Draw(img)
    
    # Try to use a decent font, fall back to default if not available
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 60)
    except:
        font = ImageFont.load_default()
    
    # Calculate text position (center)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # Draw text
    draw.text((x, y), text, fill='#2a3127', font=font)
    
    # Save image
    img.save(output_path, 'JPEG', quality=85)
    print(f"Created: {output_path}")

def create_silent_audio(duration_seconds, output_path):
    """Create a silent MP3 audio file using ffmpeg"""
    import subprocess
    
    # Use ffmpeg to create silent audio
    # If ffmpeg is not available, we'll just create an empty file as placeholder
    try:
        subprocess.run([
            'ffmpeg', '-f', 'lavfi', '-i', f'anullsrc=r=44100:cl=mono',
            '-t', str(duration_seconds), '-q:a', '9', '-acodec', 'libmp3lame',
            '-y', output_path
        ], check=True, capture_output=True)
        print(f"Created: {output_path}")
    except (subprocess.CalledProcessError, FileNotFoundError):
        # If ffmpeg is not available, create a minimal MP3 header
        # This is a basic MP3 file header for a silent file
        with open(output_path, 'wb') as f:
            # Minimal valid MP3 file
            f.write(b'\xff\xfb\x90\x00')
        print(f"Created (basic): {output_path}")

def main():
    base_dir = 'stories'
    
    # Story 1: The Healthy Garden
    story1_dir = os.path.join(base_dir, 'story-1')
    story1_pages_dir = os.path.join(story1_dir, 'pages')
    
    # Create cover
    create_placeholder_image(
        800, 1000, STORY_COLORS['story-1']['cover'],
        'The Healthy\nGarden',
        os.path.join(story1_dir, 'cover.jpg')
    )
    
    # Create pages
    for i in range(1, 4):
        color = STORY_COLORS['story-1']['pages'][(i-1) % len(STORY_COLORS['story-1']['pages'])]
        create_placeholder_image(
            800, 1000, color,
            f'Story 1\nPage {i}',
            os.path.join(story1_pages_dir, f'page-{i}.jpg')
        )
        create_silent_audio(3, os.path.join(story1_pages_dir, f'page-{i}.mp3'))
    
    # Story 2: Rainbow Vegetables
    story2_dir = os.path.join(base_dir, 'story-2')
    story2_pages_dir = os.path.join(story2_dir, 'pages')
    
    # Create cover
    create_placeholder_image(
        800, 1000, STORY_COLORS['story-2']['cover'],
        'Rainbow\nVegetables',
        os.path.join(story2_dir, 'cover.jpg')
    )
    
    # Create pages
    for i in range(1, 4):
        color = STORY_COLORS['story-2']['pages'][(i-1) % len(STORY_COLORS['story-2']['pages'])]
        create_placeholder_image(
            800, 1000, color,
            f'Story 2\nPage {i}',
            os.path.join(story2_pages_dir, f'page-{i}.jpg')
        )
        create_silent_audio(3, os.path.join(story2_pages_dir, f'page-{i}.mp3'))

if __name__ == '__main__':
    main()
