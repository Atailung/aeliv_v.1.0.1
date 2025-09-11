import { cn } from "@/lib/utils";
import { CloudUpload,  ImageIcon, Upload, XIcon } from "lucide-react";
import { Button,} from "../ui/button";
import { IconReload } from "@tabler/icons-react";
import Image from "next/image";



export function RenderState({isDragActive}: {isDragActive: boolean}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center max-auto size-12 rounded-full bg-muted mb-4">
        <CloudUpload  className= {cn("size-6 text-muted-foreground", isDragActive  && "text-foreground")}/>
      </div>
      <p className="text-base font-semibold text-muted-foreground">{isDragActive ? "Drop the files here ..." : "Drag 'n' drop some files here, or click to select files"}</p>
      <Button type="button" variant="outline" className="mt-4">
        <Upload className="mr-2" />
        Choose Files
      </Button>
    </div>
  )
}

export function RenderErrorState (){
    return(
        <div className="text-center">
            <div className="flex items-center justify-center max-auto size-12 rounded-full bg-destructive/10 mb-4">
                <ImageIcon  className= {cn("size-6 text-red", "text-center justify-center")}/>
            </div>
            <p className="text-red font-semibold">Error uploading files</p>
            <p className="text-sm text-muted-foreground">Please check your internet connection and try again.</p>
            
            <Button type="button" variant="outline" className="mt-4">
                <IconReload className=" hover:animation-spin" />
                Try Again
            </Button>
        </div>
    )
}


export function RenderUploadingState({
  previewUrl
}: {previewUrl: string}) {
    return(
      <>
      <Image 
        src={previewUrl} 
        alt="Preview"
        width={350}
        height={250}
        className="object-contain p-2"
      />

       <Button variant={"destructive"} size={"icon"} className={cn("absolute top-4 right-4 rounded-full hover:bg-red-500")} onClick={() => URL.revokeObjectURL(previewUrl)}>
        <XIcon className=" hover:animation-spin" />
       </Button>
      </>
    )
}





