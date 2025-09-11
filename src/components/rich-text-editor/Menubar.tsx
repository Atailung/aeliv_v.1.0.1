"use client"
import type { Editor } from "@tiptap/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Toggle } from "../ui/toggle"
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Bold,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Italic,
  ListIcon,
  ListOrdered,
  Redo,
  Strikethrough,
  Undo,
  Underline,
  Quote,
  Link,
  Minus,
  Type,
  Highlighter,
  Code2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

interface iAppProps {
  editor: Editor | null
}

function Menubar({ editor }: iAppProps) {
  if (!editor) {
    return null
  }
  return (
    <div className="border border-input border-x-0 border-t-0 rounded rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1 items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() => {
                  editor.chain().focus().toggleBold().run()
                }}
                className={cn(editor.isActive("bold") && "bg-mute text-mute-foreground")}
              >
                <Bold />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() => {
                  editor.chain().focus().toggleItalic().run()
                }}
                className={cn(editor.isActive("italic") && "bg-mute text-mute-foreground")}
              >
                <Italic />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("underline")}
                onPressedChange={() => {
                  editor.chain().focus().toggleUnderline().run()
                }}
                className={cn(editor.isActive("underline") && "bg-mute text-mute-foreground")}
              >
                <Underline />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() => {
                  editor.chain().focus().toggleStrike().run()
                }}
                className={cn(editor.isActive("strike") && "bg-mute text-mute-foreground")}
              >
                <Strikethrough />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Strike</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("code")}
                onPressedChange={() => {
                  editor.chain().focus().toggleCode().run()
                }}
                className={cn(editor.isActive("code") && "bg-mute text-mute-foreground")}
              >
                <CodeIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Inline Code</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("highlight")}
                onPressedChange={() => {
                  editor.chain().focus().toggleMark('highlight').run()
                }}
                className={cn(editor.isActive("highlight") && "bg-mute text-mute-foreground")}
              >
                <Highlighter />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Highlight</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border mx-2 "></div>

        <div className="flex flex-wrap gap-1 items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() => {
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }}
                className={cn(editor.isActive("heading", { level: 1 }) && "bg-mute text-mute-foreground")}
              >
                <Heading1Icon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 1</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() => {
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }}
                className={cn(editor.isActive("heading", { level: 2 }) && "bg-mute text-mute-foreground")}
              >
                <Heading2Icon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 2</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() => {
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }}
                className={cn(editor.isActive("heading", { level: 3 }) && "bg-mute text-mute-foreground")}
              >
                <Heading3Icon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 3</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("blockquote")}
                onPressedChange={() => {
                  editor.chain().focus().toggleBlockquote().run()
                }}
                className={cn(editor.isActive("blockquote") && "bg-mute text-mute-foreground")}
              >
                <Quote />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Blockquote</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("codeBlock")}
                onPressedChange={() => {
                  editor.chain().focus().toggleCodeBlock().run()
                }}
                className={cn(editor.isActive("codeBlock") && "bg-mute text-mute-foreground")}
              >
                <Code2 />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Code Block</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border mx-2 "></div>

        <div className="flex flex-wrap gap-1 items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => {
                  editor.chain().focus().toggleBulletList().run()
                }}
                className={cn(editor.isActive("bulletList") && "bg-mute text-mute-foreground")}
              >
                <ListIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => {
                  editor.chain().focus().toggleOrderedList().run()
                }}
                className={cn(editor.isActive("orderedList") && "bg-mute text-mute-foreground")}
              >
                <ListOrdered />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Ordered List</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border mx-2 "></div>
        <div className="flex flex-wrap gap-1 items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "left" })}
                onPressedChange={() => {
                  editor.chain().focus().setTextAlign("left").run()
                }}
                className={cn(editor.isActive({ textAlign: "left" }) && "bg-mute text-mute-foreground")}
              >
                <AlignLeftIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Text Align Left</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "center" })}
                onPressedChange={() => {
                  editor.chain().focus().setTextAlign("center").run()
                }}
                className={cn(editor.isActive({ textAlign: "center" }) && "bg-mute text-mute-foreground")}
              >
                <AlignCenterIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Text Align Center</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "right" })}
                onPressedChange={() => {
                  editor.chain().focus().setTextAlign("right").run()
                }}
                className={cn(editor.isActive({ textAlign: "right" }) && "bg-mute text-mute-foreground")}
              >
                <AlignRightIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Right</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border mx-2 "></div>

        <div className="flex flex-wrap gap-1 items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("link")}
                onPressedChange={() => {
                  if (editor.isActive("link")) {
                    editor.chain().focus().unsetLink().run()
                  } else {
                    const url = window.prompt("Enter URL:")
                    if (url) {
                      editor.chain().focus().setLink({ href: url }).run()
                    }
                  }
                }}
                className={cn(editor.isActive("link") && "bg-mute text-mute-foreground")}
              >
                <Link />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Link</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                <Minus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Horizontal Rule</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              >
                <Type />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear Formatting</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border mx-2 "></div>

        <div className="flex flex-wrap gap-1 items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                type="submit"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
              >
                <Undo />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                type="submit"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
              >
                <Redo />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}

export default Menubar
