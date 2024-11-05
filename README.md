# Tiled to TIC-80 export

These are a set of extensions/export plugins for the [Tiled map editor](https://www.mapeditor.org/) that adds the following type to the "Export As" menu:

* TIC-80 map files (*.ticmap)

The .ticmap extension was chosen simply to differentiate it from other formats; there's no formal extension or specification for the file other than the raw data format exported by `export tiles tiledata.ticmap`.

The format exported is the full set of map data for the current bank, or the bank specified in the `export` command. It is a packed Uint8 array of 240*136 bytes regardless of how much map data is entered.

## Installation
The extension file (./tic-map-export.js) should either be placed in an `/extensions` subfolder where the Tiled project will reside, or can be installed directly to Tiled.

* Open Tiled and go to Edit > Preferences > Plugins and click the "Open" button to open the extensions directory.
* Download [tic-map-export.js](./tic-map-export.js) in this repository and copy the file to that location. The script can be placed either directly in the extensions directory or in a subdirectory.

## Tiled to TIC-80
The export script currently only supports a single tile layer, so will look for the first layer of this type when exporting. Make sure your tilemap uses 8x8 tiles, and the map size is 240x136. The export will abort if the map is any other size.

Once the script is installed, in Tiled go to File > Export As... and select "TIC-80 map files (*.ticmap)" from the file type dropdown and specify the filename.

This file can then be imported inside TIC-80's CLI with `import tiles map_filename.ticmap`.

## TIC-80 to Tiled
To generate a TICMAP file, run `export tiles tilemap.ticmap` from within TIC-80's CLI (press Escape if in any of the editors). You can optionally export files from another bank, but it's advisable to keep the different maps separated by bank and re-import them separately.

To convert the .ticmap file to a Tiled map, place [tic2tiled.py](./tic2tiled.py) in the folder that contains your .ticmap file.

Run it as follows: `tic2tiled.py tilemap.ticmap`

By default, this will generate `tic-out.tsx` and `tic-out.tmx`. Open the .tmx file to edit the tilemap, or optionally import it into a Tiled project.

The script defaults to referencing the file `tiles.png` for the spritesheet, but this can be changed by supplying a second optional positional parameter: `tic2tiled.py tilemap.ticmap tilesheet.png`.

You can optionally specify the generated filenames with the `--tiled_name` parameter: `tic2tiled.py tilemap.ticmap --tiled_name coolproject` to generate `coolproject.tsx` and `coolproject.tmx`.

Lastly, the generated layer name can be changed from the default "TIC-80" to something else: `tic2tiled.py tilemap.ticmap --layer_name "Tiles"`.

Use `tic2tiled.py -h` to see these parameters from the command line.
