import os, sys
import xml.etree.ElementTree as ET
import argparse

parser = argparse.ArgumentParser(description='TIC-80 to Tiled converter')

# required positional argument: the input .ticmap file
parser.add_argument('ticmap_file', type=str, help='Filename of the input .ticmap file')
parser.add_argument('tiles_image', type=str, nargs='?', help='Filename of the spritesheet to use. Defaults to "tiles.png".')
parser.add_argument('--tiled_name', type=str, nargs='?', help='Filename of the output .tsx and .tsm files. Defaults to "tic-out".')
parser.add_argument('--layer_name', type=str, nargs='?', help='Name of the exported Tiled layer. Defaults to "TIC-80".')

args = parser.parse_args()

tiles_image_filename = 'tiles.png' if args.tiles_image == None else args.tiles_image
tiled_name = 'tic-out' if args.tiled_name == None else args.tiled_name.replace('.tsx', '').replace('.tsm', '')

tilesheet_filename = tiled_name + '.tsx'
tilemap_filename = tiled_name + '.tmx'

tiles_out = ""
counter = 0
with open(args.ticmap_file, "rb") as f:
    file_bytes = f.read()
    for byte in file_bytes:
        tiles_out += str(byte) + ","
        counter += 1
        if counter > 240:
            counter = 0
            tiles_out += '\n'

# why generate XML when you can just hack it in
output = '<?xml version="1.0" encoding="UTF-8"?>\n'
output += '<map version="1.10" orientation="orthogonal" renderorder="right-down" width="240" height="136" tilewidth="8" tileheight="8">\n'
output += '<tileset firstgid="0" source="{0}"/>\n'.format(tilesheet_filename)
output += '<layer id="1" name="TIC-80" width="240" height="136">\n'
output += '<data encoding="csv">\n'
output += tiles_out[:-1] + '\n'
output += '</data></layer></map>\n'

with open(tilemap_filename, 'w') as f:
    f.write(output)
print('Wrote {0}'.format(tilemap_filename))

output = '<?xml version="1.0" encoding="UTF-8"?>\n'
output += '<tileset version="1.9" name="tiles" tilewidth="8" tileheight="8" tilecount="256" columns="16">\n'
output += ' <image source="{0}" width="128" height="128"/>\n</tileset>\n'.format(tiles_image_filename)

with open(tilesheet_filename, 'w') as f:
    f.write(output)
print('Wrote {0}'.format(tilesheet_filename))
