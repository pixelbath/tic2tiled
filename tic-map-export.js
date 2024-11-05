/*
 * tiled-to-tic-export.js
 *
 * This extension adds the "TIC-80 map files" type to the "Export As" menu,
 * which generates tile arrays that can be imported directly into TIC-80
 * using whatever is in its tilesheet.
 *
 * The map is assumed to be the entire MAP region in TIC-80 since that is
 * what it exports when executing "export map mapname.map" (the extension
 * .map is only used for convenience; it could be anything or nothing).
 * 
 * Each tile layer is parsed in 32x32 chunks (a screenblock on GBA) and converted
 * to a C array of hexadecimal tile IDs - blank tiles are defaulted to 0x0000.
 * For example, 64x64 maps are parsed as four screenblocks like this:
 * 
 * This exporter currently only exports the first tile (not object or other type) layer.
 *
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

var customMapFormat = {
    name: "TIC-80 map files",
    extension: "ticmap",
    write:

    function(p_map, p_fileName) {
        // Only allow valid map sizes to be parsed
        if (p_map.width != 240 || p_map.height != 136) {
            return "Export failed: Invalid map size! Map tile width and height must be 240x136.";
        }

        // Split full filename path into the filename (without extension) and the directory
        var fileBaseName = FileInfo.completeBaseName(p_fileName).replace(/[^a-zA-Z0-9-_]/g, "_");
        var filePath = FileInfo.path(p_fileName)+"/";

        // Replace the ‘/’ characters in the file path for ‘\’ on Windows
        filePath = FileInfo.toNativeSeparators(filePath);

        var tilemapLength = p_map.width * p_map.height;

        var ticFileData = new Uint8Array(tilemapLength);

        var foundTileLayer = false;

        for (let i = 0; i < p_map.layerCount; ++i) {
            let currentLayer = p_map.layerAt(i);

            if (currentLayer.isTileLayer && !foundTileLayer) {
                foundTileLayer = true;
                for (let y = 0; y < p_map.height; ++y) {
                    for (let x = 0; x < p_map.width; ++x) {
                        let currentTile = currentLayer.cellAt(x, y);
                        let currentTileID = currentTile.tileId;

                        if (currentTileID == "-1") {
                            currentTileID = 0;
                        }
                        
                        // do we need to handle flips? suppress them? maybe next version.
                        // if (currentTile.flippedHorizontally) { }
                        // if (currentTile.flippedVertically) { }

                        ticFileData[(y * 240) + (x % 240)] = currentTileID;
                    }
                }
            }
        }

        // Write data to disk
        var ticFile = new BinaryFile(filePath+fileBaseName+".ticmap", BinaryFile.WriteOnly);
        ticFile.write(ticFileData.buffer);
        ticFile.commit();
        tiled.log("Tilemap exported to "+filePath+fileBaseName+".ticmap");
    }
}

tiled.registerMapFormat("ticmap", customMapFormat)
