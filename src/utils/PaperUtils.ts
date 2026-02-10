import { fabric } from 'fabric';
import paper from 'paper';

/**
 * PaperUtils.ts
 * 
 * Handles bidirectional conversion between Fabric.js and Paper.js
 * to enable advanced boolean operations (Union, Subtract, Intersect, Exclude).
 */

// Initialize Paper.js with a hidden canvas if not already initialized
let paperInitialized = false;

export const initPaper = () => {
    if (paperInitialized) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    paper.setup(canvas);
    paperInitialized = true;
};

/**
 * Converts a Fabric object to a Paper.js Item
 */
export const fabricToPaper = (obj: fabric.Object): paper.Item | null => {
    if (!paperInitialized) initPaper();

    // Fabric's toSVG is the most reliable way to transfer geometry
    // We wrap it in an SVG string that Paper can import
    const svg = obj.toSVG();
    const item = paper.project.importSVG(svg, { insert: false });

    // Apply transformations that might not be fully captured or need adjustment
    // Note: Paper.js importSVG handles most transforms, but we might need to sync matrices
    // For now, we rely on the SVG str representation.

    return item;
};

/**
 * Converts a Paper.js Item back to a Fabric object (usually a Path)
 */
export const paperToFabric = (item: paper.Item): Promise<fabric.Object | null> => {
    return new Promise((resolve) => {
        // Export as SVG string
        const svgString = item.exportSVG({ asString: true }) as string;

        // Load into Fabric
        fabric.loadSVGFromString(svgString, (objects, options) => {
            if (!objects || objects.length === 0) {
                resolve(null);
                return;
            }

            // If multiple paths, group them or merge them
            // Usually boolean ops result in a compound path which Fabric handles as a single Path or Group
            const result = fabric.util.groupSVGElements(objects, options);

            // Check if it's a path or group and return
            resolve(result);
        });
    });
};

/**
 * Performs a boolean operation on two Fabric objects
 */
export const performBooleanOperation = async (
    type: 'unite' | 'subtract' | 'intersect' | 'exclude',
    object1: fabric.Object,
    object2: fabric.Object
): Promise<fabric.Object | null> => {
    if (!paperInitialized) initPaper();

    try {
        const p1 = fabricToPaper(object1) as paper.PathItem;
        const p2 = fabricToPaper(object2) as paper.PathItem;

        if (!p1 || !p2) return null;

        let result: paper.PathItem;

        switch (type) {
            case 'unite':
                result = p1.unite(p2);
                break;
            case 'subtract':
                result = p1.subtract(p2);
                break;
            case 'intersect':
                result = p1.intersect(p2);
                break;
            case 'exclude':
                result = p1.exclude(p2);
                break;
            default:
                return null;
        }

        // Convert result back to Fabric
        const fabricResult = await paperToFabric(result);
        return fabricResult;

    } catch (e) {
        console.error('Boolean operation failed:', e);
        return null;
    }
};

/**
 * Flattens a text object into a vector path using Paper.js (via SVG)
 */
export const flattenTextToPath = async (textObj: fabric.Text | fabric.IText): Promise<fabric.Object | null> => {
    if (!paperInitialized) initPaper();

    // Convert text to SVG (Fabric handles font outlines in toSVG)
    const pItem = fabricToPaper(textObj);
    if (!pItem) return null;

    // Convert back to Fabric Path
    return await paperToFabric(pItem);
};
