'use client';

import { cn, getUrlFromStringIfValid } from '@repo/utils';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Command } from 'cmdk';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  ListOrdered,
  LucideIcon,
  Redo,
  Strikethrough,
  TextIcon,
  TextQuote,
  Trash,
  UnderlineIcon,
  Undo
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button as ButtonComponent } from '../button';
import { Input } from '../input';
import { Popover } from '../popover';
import { Tooltip } from '../tooltip';

type RichTextProps = {
  onChange: (html: string) => void;
  content: string;
};

export function RichText({ onChange, content }: RichTextProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https']
      })
    ],
    editorProps: {
      attributes: {
        class: 'prose px-5 my-5 focus:outline-none max-h-[300px] overflow-y-auto max-w-full',
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off'
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    content: content,
    immediatelyRender: false
  });

  return (
    <div className="flex min-h-48 w-full flex-col rounded-md ring-1 ring-inset ring-gray-300">
      <Toolbar editor={editor} content={content} />
      <EditorContent editor={editor} />
    </div>
  );
}

type ToolbarProps = {
  editor: Editor | null;
  content: string;
};

export type SelectorItem = {
  name: string;
  icon: LucideIcon;
  command: (editor: ReturnType<typeof useEditor>['editor']) => void;
  isActive: (editor: ReturnType<typeof useEditor>['editor']) => boolean;
};

const items: SelectorItem[] = [
  {
    name: 'Text',
    icon: TextIcon,
    command: (editor) => editor.chain().focus().clearNodes().run(),
    // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
    isActive: (editor) => editor.isActive('paragraph') && !editor.isActive('bulletList') && !editor.isActive('orderedList')
  },
  {
    name: 'Heading 1',
    icon: Heading1,
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 })
  },
  {
    name: 'Heading 2',
    icon: Heading2,
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 })
  },
  {
    name: 'Heading 3',
    icon: Heading3,
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 3 })
  },
  {
    name: 'Bullet List',
    icon: ListOrdered,
    command: (editor) => editor.chain().focus().clearNodes().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList')
  },
  {
    name: 'Numbered List',
    icon: ListOrdered,
    command: (editor) => editor.chain().focus().clearNodes().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList')
  },
  {
    name: 'Quote',
    icon: TextQuote,
    command: (editor) => editor.chain().focus().clearNodes().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive('blockquote')
  },
  {
    name: 'Code',
    icon: Code,
    command: (editor) => editor.chain().focus().clearNodes().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive('codeBlock')
  }
];

function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const [openNode, setOpenNode] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  const activeNodeItem = items.filter((item) => item.isActive(editor)).pop() ?? {
    name: 'Multiple'
  };

  return (
    <div className="flex w-full flex-wrap items-start justify-between gap-5 border-b border-gray-300 px-3 py-2">
      <div className="flex w-full flex-wrap items-center justify-start gap-1 [&>button]:cursor-pointer">
        <Popover
          openPopover={openNode}
          setOpenPopover={setOpenNode}
          align="start"
          content={
            <Command defaultValue={activeNodeItem.name} tabIndex={0} loop className="focus:outline-none">
              <Command.List className="flex w-screen flex-col gap-1 p-1.5 text-sm sm:w-auto sm:min-w-[160px]">
                {items.map((item) => (
                  <Command.Item
                    key={item.name}
                    value={item.name}
                    className={cn(
                      'flex cursor-pointer select-none items-center justify-between gap-2 whitespace-nowrap rounded-md p-1.5 text-sm text-neutral-600',
                      'data-[selected=true]:bg-gray-100'
                    )}
                    onSelect={() => {
                      item.command(editor);
                      setOpenNode(false);
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="rounded-sm border border-gray-200 p-1">
                        <item.icon className="size-4" />
                      </div>
                      <span>{item.name}</span>
                    </div>
                    {item.name === activeNodeItem.name && <Check className="size-4 shrink-0 text-neutral-500" />}
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          }
        >
          <button className={cn('flex items-center gap-1 rounded-md p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none')}>
            {activeNodeItem.name}
            <ChevronDown className="h-4 w-4" />
          </button>
        </Popover>

        <Button
          tooltip="Bold"
          icon={<Bold className="h-5 w-5" />}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          isActive={editor.isActive('bold')}
        />

        <Button
          tooltip="Italic"
          icon={<Italic className="h-5 w-5" />}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          isActive={editor.isActive('italic')}
        />

        <Button
          tooltip="Underline"
          icon={<UnderlineIcon className="h-5 w-5" />}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          isActive={editor.isActive('underline')}
        />

        <Button
          tooltip="Strikethrough"
          icon={<Strikethrough className="h-5 w-5" />}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          isActive={editor.isActive('strike')}
        />

        <Button
          tooltip="Code"
          icon={<Code className="h-5 w-5" />}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setCode().run();
          }}
          isActive={editor.isActive('code')}
        />

        <Popover
          popoverContentClassName="drop-shadow-sm"
          openPopover={openLink}
          setOpenPopover={setOpenLink}
          align="start"
          content={
            <div className="p-1">
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.currentTarget as HTMLFormElement;
                  const input = target[0] as HTMLInputElement;
                  const url = getUrlFromStringIfValid(input.value);
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run();
                    setOpenLink(false);
                  } else {
                    toast.error('Invalid URL');
                  }
                }}
              >
                <Input
                  autoFocus={false}
                  className="h-8 flex-1 border-none px-2 py-1.5 ring-0 focus:border-none focus:ring-0"
                  placeholder="Enter URL"
                  defaultValue={editor.getAttributes('link').href || ''}
                />
                {editor.getAttributes('link').href ? (
                  <ButtonComponent
                    type="button"
                    onClick={() => {
                      editor.chain().focus().unsetLink().run();
                      setOpenLink(false);
                    }}
                    variant="outline"
                    text="Unset link"
                    className="h-8 w-auto gap-1 px-3 hover:text-red-600"
                    icon={<Trash className="h-3 w-3" />}
                  />
                ) : (
                  <ButtonComponent
                    type="submit"
                    variant="outline"
                    text="Set link"
                    className="h-8 w-auto gap-1 px-3"
                    icon={<LinkIcon className="h-3 w-3" />}
                  />
                )}
              </form>
            </div>
          }
        >
          <Button tooltip="Link" icon={<LinkIcon className="h-5 w-5" />} isActive={openLink || editor.isActive('link')} />
        </Popover>

        <Button
          tooltip="Align Left"
          icon={<AlignLeft className="h-5 w-5" />}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign('left').run();
          }}
          isActive={editor.isActive({ textAlign: 'left' })}
        />

        <Button
          tooltip="Align Center"
          icon={<AlignCenter className="h-5 w-5" />}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign('center').run();
          }}
          isActive={editor.isActive({ textAlign: 'center' })}
        />

        <Button
          tooltip="Align Right"
          icon={<AlignRight className="h-5 w-5" />}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign('right').run();
          }}
          isActive={editor.isActive({ textAlign: 'right' })}
        />

        <Button
          tooltip="Undo"
          icon={<Undo className="h-5 w-5" />}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          isActive={editor.isActive('undo')}
        />

        <Button
          tooltip="Redo"
          icon={<Redo className="h-5 w-5" />}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          isActive={editor.isActive('redo')}
        />
      </div>
    </div>
  );
}

type ButtonProps = {
  tooltip?: string;
  className?: string;
  isActive?: boolean;
  icon?: React.ReactNode;
};

function Button({ tooltip, className, isActive, icon, ...props }: React.ComponentProps<'button'> & ButtonProps) {
  const element = (
    <button {...props} className={cn('rounded-md p-2 text-white outline-none', isActive ? 'bg-gray-700 p-2 text-white' : 'text-gray-500', className)}>
      {icon}
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip className="rounded-md border-gray-200 bg-gray-50 shadow" content={<div className="px-2 py-1 text-xs text-gray-500">{tooltip}</div>}>
        {element}
      </Tooltip>
    );
  }

  return element;
}
