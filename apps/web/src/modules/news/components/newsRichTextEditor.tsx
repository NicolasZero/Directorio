import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AlignCenter, AlignLeft, AlignRight, Bold, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Quote, Underline } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NewsImagePicker from './newsImagePicker'
import { sanitizeNewsHtml } from '../utils/newsContent'

type NewsRichTextEditorProps = {
  value: string
  onChange: (value: string) => void
}

type ToolbarButtonProps = {
  label: string
  icon: ReactNode
  onClick: () => void
}

function ToolbarButton({ label, icon, onClick }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={label}
      aria-label={label}
      className="h-9 w-9"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {icon}
    </Button>
  )
}

export default function NewsRichTextEditor({ value, onChange }: NewsRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const savedRangeRef = useRef<Range | null>(null)
  const lastEmittedValueRef = useRef<string | null>(null)
  const [imagePickerOpen, setImagePickerOpen] = useState(false)

  useEffect(() => {
    if (lastEmittedValueRef.current === value) {
      lastEmittedValueRef.current = null
      return
    }

    const editor = editorRef.current
    if (editor && editor.innerHTML !== value) editor.innerHTML = sanitizeNewsHtml(value)
  }, [value])

  const saveSelection = () => {
    const editor = editorRef.current
    const selection = window.getSelection()
    if (editor && selection?.rangeCount && editor.contains(selection.anchorNode)) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange()
    }
  }

  const restoreSelection = () => {
    const editor = editorRef.current
    const selection = window.getSelection()
    if (!editor || !selection) return
    editor.focus()
    if (savedRangeRef.current) {
      selection.removeAllRanges()
      selection.addRange(savedRangeRef.current)
    }
  }

  const emitChange = () => {
    if (editorRef.current) {
      const cleanValue = sanitizeNewsHtml(editorRef.current.innerHTML)
      lastEmittedValueRef.current = cleanValue
      onChange(cleanValue)
    }
  }

  const runCommand = (command: string, value?: string) => {
    restoreSelection()
    document.execCommand(command, false, value)
    saveSelection()
    emitChange()
  }

  const applyInlineStyle = (property: 'color' | 'fontSize', value: string) => {
    restoreSelection()
    const selection = window.getSelection()
    const editor = editorRef.current
    if (!selection?.rangeCount || !editor) return

    const range = selection.getRangeAt(0)
    if (range.collapsed || !editor.contains(range.commonAncestorContainer)) return

    const span = document.createElement('span')
    span.style[property] = value
    span.append(range.extractContents())
    range.insertNode(span)
    range.selectNodeContents(span)
    selection.removeAllRanges()
    selection.addRange(range)
    savedRangeRef.current = range.cloneRange()
    emitChange()
  }

  const insertImage = (url: string) => {
    restoreSelection()
    const image = document.createElement('img')
    image.src = url
    image.alt = 'Imagen insertada en la noticia'
    const selection = window.getSelection()
    const editor = editorRef.current

    if (selection?.rangeCount && editor) {
      const range = selection.getRangeAt(0)
      if (editor.contains(range.commonAncestorContainer)) {
        range.deleteContents()
        range.insertNode(image)
        range.setStartAfter(image)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        editor.append(image)
      }
    } else {
      editorRef.current?.append(image)
    }

    saveSelection()
    emitChange()
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-input focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20">
        <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-2">
        <ToolbarButton label="Negrita" icon={<Bold className="h-4 w-4" />} onClick={() => runCommand('bold')} />
        <ToolbarButton label="Cursiva" icon={<Italic className="h-4 w-4" />} onClick={() => runCommand('italic')} />
        <ToolbarButton label="Subrayado" icon={<Underline className="h-4 w-4" />} onClick={() => runCommand('underline')} />
        <span className="mx-1 h-6 border-l" />
        <ToolbarButton label="Encabezado 2" icon={<Heading2 className="h-4 w-4" />} onClick={() => runCommand('formatBlock', 'h2')} />
        <ToolbarButton label="Encabezado 3" icon={<Heading3 className="h-4 w-4" />} onClick={() => runCommand('formatBlock', 'h3')} />
        <ToolbarButton label="Cita" icon={<Quote className="h-4 w-4" />} onClick={() => runCommand('formatBlock', 'blockquote')} />
        <ToolbarButton label="Lista" icon={<List className="h-4 w-4" />} onClick={() => runCommand('insertUnorderedList')} />
        <ToolbarButton label="Lista numerada" icon={<ListOrdered className="h-4 w-4" />} onClick={() => runCommand('insertOrderedList')} />
        <span className="mx-1 h-6 border-l" />
        <ToolbarButton label="Alinear a la izquierda" icon={<AlignLeft className="h-4 w-4" />} onClick={() => runCommand('justifyLeft')} />
        <ToolbarButton label="Centrar" icon={<AlignCenter className="h-4 w-4" />} onClick={() => runCommand('justifyCenter')} />
        <ToolbarButton label="Alinear a la derecha" icon={<AlignRight className="h-4 w-4" />} onClick={() => runCommand('justifyRight')} />
        <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md px-2 text-sm hover:bg-accent" title="Color de texto">
          <span className="text-xs font-medium">Color</span>
          <input
            type="color"
            aria-label="Color de texto"
            className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0"
            onMouseDown={saveSelection}
            onChange={(event) => applyInlineStyle('color', event.target.value)}
          />
        </label>
        <select
          aria-label="Tamaño de fuente"
          defaultValue="16px"
          className="h-9 rounded-md border bg-background px-2 text-sm"
          onMouseDown={saveSelection}
          onChange={(event) => applyInlineStyle('fontSize', event.target.value)}
        >
          <option value="14px">Pequeño</option>
          <option value="16px">Normal</option>
          <option value="20px">Grande</option>
          <option value="24px">Título</option>
          <option value="32px">Muy grande</option>
        </select>
        <ToolbarButton label="Insertar enlace" icon={<Link2 className="h-4 w-4" />} onClick={() => {
          const url = window.prompt('Introduce la dirección del enlace:')
          if (url) runCommand('createLink', url)
        }} />
          <ToolbarButton
            label="Biblioteca de imágenes"
            icon={<ImagePlus className="h-4 w-4" />}
            onClick={() => {
              saveSelection()
              setImagePickerOpen(true)
            }}
          />
        </div>
        <div
          ref={editorRef}
          contentEditable
          role="textbox"
          aria-label="Contenido de la noticia"
          aria-multiline="true"
          className="news-editor min-h-72 px-5 py-4 text-base leading-7 outline-none"
          onInput={emitChange}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          onBlur={saveSelection}
        />
        <p className="border-t px-4 py-2 text-xs text-muted-foreground">Puedes dar formato al texto y subir imágenes de hasta 5 MB.</p>
      </div>
      <NewsImagePicker
        open={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onSelect={(url) => {
          insertImage(url)
          setImagePickerOpen(false)
        }}
      />
    </>
  )
}
