declare module 'imagetracerjs' {
    interface ImageTracerOptions {
        ltres?: number;
        qtres?: number;
        pathomit?: number;
        colorsampling?: number;
        numberofcolors?: number;
        mincolorratio?: number;
        colorquantcycles?: number;
        scale?: number;
        simplify?: number;
        roundcoords?: number;
        lcpr?: number;
        qcpr?: number;
        desc?: boolean;
        viewbox?: boolean;
        blurradius?: number;
        blurdelta?: number;
    }

    interface ImageTracer {
        imageToSVG(
            url: string,
            callback: (svgstr: string) => void,
            options?: ImageTracerOptions
        ): void;
        imagedataToSVG(
            imagedata: ImageData,
            options?: ImageTracerOptions
        ): string;
    }

    const ImageTracer: ImageTracer;
    export default ImageTracer;
}
