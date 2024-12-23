'use client';

import { cn, getUrlFromStringIfValid } from '@repo/utils';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
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
  className?: string;
  isStickyToolbar?: boolean;
  classEditorContent?: string;
  stylesEditorContent?: string;
  excludedToolbarItems?: string[];
};

export function RichText({
  onChange,
  content,
  className,
  isStickyToolbar,
  stylesEditorContent,
  classEditorContent,
  excludedToolbarItems
}: RichTextProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true
      }),
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
        class: cn('prose px-5 my-5 focus:outline-none overflow-y-auto max-w-full h-28', classEditorContent),
        style: stylesEditorContent || '',
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
    <div className={cn('flex w-full flex-col rounded-md border border-gray-300', className)}>
      <Toolbar editor={editor} isStickyToolbar={isStickyToolbar} excludedToolbarItems={excludedToolbarItems} />
      <EditorContent editor={editor} />
    </div>
  );
}

type ToolbarProps = {
  editor: Editor | null;
  isStickyToolbar?: RichTextProps['isStickyToolbar'];
  excludedToolbarItems?: RichTextProps['excludedToolbarItems'];
};

export type SelectorItem = {
  name: string;
  icon: LucideIcon;
  command: (editor: ReturnType<typeof useEditor>['editor']) => void;
  isActive: (editor: ReturnType<typeof useEditor>['editor']) => boolean;
};

export type ColorMenuItem = {
  name: string;
  color: string;
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

const TEXT_COLORS: ColorMenuItem[] = [
  {
    name: 'Default',
    color: ''
  },
  {
    name: 'Gray',
    color: 'rgb(120, 119, 116)'
  },
  {
    name: 'Brown',
    color: 'rgb(159, 107, 83)'
  },
  {
    name: 'Orange',
    color: 'rgb(217, 115, 13)'
  },
  {
    name: 'Yellow',
    color: 'rgb(203, 145, 47)'
  },
  {
    name: 'Green',
    color: 'rgb(68, 131, 97)'
  },
  {
    name: 'Blue',
    color: 'rgb(51, 126, 169)'
  },
  {
    name: 'Purple',
    color: 'rgb(144, 101, 176)'
  },
  {
    name: 'Pink',
    color: 'rgb(193, 76, 138)'
  },
  {
    name: 'Red',
    color: 'rgb(212, 76, 71)'
  }
];

const HIGHLIGHT_COLORS: ColorMenuItem[] = [
  {
    name: 'Default',
    color: ''
  },
  {
    name: 'Gray',
    color: 'rgb(241, 241, 239)'
  },
  {
    name: 'Brown',
    color: 'rgb(244, 238, 238)'
  },
  {
    name: 'Orange',
    color: 'rgb(251, 236, 221)'
  },
  {
    name: 'Yellow',
    color: 'rgb(251, 243, 219)'
  },
  {
    name: 'Green',
    color: 'rgb(237, 243, 236)'
  },
  {
    name: 'Blue',
    color: 'rgb(231, 243, 248)'
  },
  {
    name: 'Purple',
    color: 'rgba(244, 240, 247, 0.8)'
  },
  {
    name: 'Pink',
    color: 'rgba(249, 238, 243, 0.8)'
  },
  {
    name: 'Red',
    color: 'rgb(253, 235, 236)'
  }
];

function Toolbar({ editor, isStickyToolbar, excludedToolbarItems }: ToolbarProps) {
  if (!editor) return null;

  const [openNode, setOpenNode] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openColor, setOpenColor] = useState(false);

  const activeNodeItem = items.filter((item) => item.isActive(editor)).pop() ?? {
    name: 'Multiple'
  };
  const activeColorItem = TEXT_COLORS.find(({ color }) => editor.isActive('textStyle', { color }));
  const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) => editor.isActive('highlight', { color }));

  return (
    <div
      className={cn(
        'flex w-full flex-wrap items-start justify-between gap-5 rounded-tl-md rounded-tr-md border-b border-gray-300 bg-white px-3 py-2',
        isStickyToolbar && 'z-1 sticky top-0'
      )}
    >
      <div className="flex w-full flex-wrap items-center justify-start gap-1 [&>button]:cursor-pointer">
        {!excludedToolbarItems?.includes('selector') && (
          <Popover
            openPopover={openNode}
            setOpenPopover={setOpenNode}
            align="start"
            content={
              <Command defaultValue={activeNodeItem.name} tabIndex={0} loop className="focus:outline-none">
                <Command.List className="flex w-screen flex-col gap-1 px-1 py-0 text-sm sm:w-auto sm:min-w-[160px]">
                  {items.map((item) => (
                    <Command.Item
                      key={item.name}
                      value={item.name}
                      className={cn(
                        'my-1 flex cursor-pointer select-none items-center justify-between gap-2 whitespace-nowrap rounded-md p-1 text-sm text-neutral-600',
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
            <button className={cn('flex h-8 items-center gap-1.5 rounded-md px-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none')}>
              {activeNodeItem.name}
              <ChevronDown className="size-4" />
            </button>
          </Popover>
        )}

        {!excludedToolbarItems?.includes('bold') && (
          <Button
            tooltip="Bold"
            icon={<Bold className="size-4" />}
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
            isActive={editor.isActive('bold')}
          />
        )}

        {!excludedToolbarItems?.includes('italic') && (
          <Button
            tooltip="Italic"
            icon={<Italic className="size-4" />}
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleItalic().run();
            }}
            isActive={editor.isActive('italic')}
          />
        )}

        {!excludedToolbarItems?.includes('underline') && (
          <Button
            tooltip="Underline"
            icon={<UnderlineIcon className="size-4" />}
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleUnderline().run();
            }}
            isActive={editor.isActive('underline')}
          />
        )}

        {!excludedToolbarItems?.includes('strikethrough') && (
          <Button
            tooltip="Strikethrough"
            icon={<Strikethrough className="size-4" />}
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleStrike().run();
            }}
            isActive={editor.isActive('strike')}
          />
        )}

        {!excludedToolbarItems?.includes('code') && (
          <Button
            tooltip="Code"
            icon={<Code className="size-4" />}
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().setCode().run();
            }}
            isActive={editor.isActive('code')}
          />
        )}

        {!excludedToolbarItems?.includes('link') && (
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
                      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
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
                        editor.chain().focus().extendMarkRange('link').unsetLink().run();
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
                      className="h-8 w-auto gap-1 bg-gray-100 px-3 hover:bg-gray-200"
                      icon={<LinkIcon className="h-3 w-3" />}
                    />
                  )}
                </form>
              </div>
            }
          >
            <Button tooltip="Link" icon={<LinkIcon className="size-4" />} isActive={openLink || editor.isActive('link')} />
          </Popover>
        )}

        {!excludedToolbarItems?.includes('color') && (
          <Popover
            openPopover={openColor}
            setOpenPopover={setOpenColor}
            align="start"
            content={
              <Command tabIndex={0} loop className="focus:outline-none">
                <Command.List className="flex w-screen flex-col gap-1 text-sm sm:w-auto sm:min-w-[160px]">
                  <Command.Group
                    value={activeColorItem?.color}
                    heading="Text color"
                    className={cn(
                      'flex flex-col p-1',
                      '[&>[cmdk-group-heading]]:p-1 [&>[cmdk-group-heading]]:text-xs [&>[cmdk-group-heading]]:text-gray-400',
                      '[&>[cmdk-group-items]]:grid [&>[cmdk-group-items]]:grid-cols-5 [&>[cmdk-group-items]]:gap-2 [&>[cmdk-group-items]]:p-1'
                    )}
                  >
                    {TEXT_COLORS.map(({ name, color }) => (
                      <Command.Item
                        key={name}
                        value={color}
                        className={cn(
                          'flex size-7 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-md border border-gray-200 text-sm text-neutral-600',
                          'data-[selected=true]:bg-gray-100'
                        )}
                        onSelect={() => {
                          if (color) {
                            editor.chain().focus().setColor(color).run();
                          } else {
                            editor.chain().focus().unsetColor().run();
                          }
                          setOpenColor(false);
                        }}
                      >
                        <span className="font-medium" style={{ color: color || 'inherit' }}>
                          A
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                  <Command.Group
                    value={activeHighlightItem?.color}
                    heading="Background color"
                    className={cn(
                      'flex flex-col p-1',
                      '[&>[cmdk-group-heading]]:p-1 [&>[cmdk-group-heading]]:text-xs [&>[cmdk-group-heading]]:text-gray-400',
                      '[&>[cmdk-group-items]]:grid [&>[cmdk-group-items]]:grid-cols-5 [&>[cmdk-group-items]]:gap-2 [&>[cmdk-group-items]]:p-1'
                    )}
                  >
                    {HIGHLIGHT_COLORS.map(({ name, color }) => (
                      <Command.Item
                        key={name}
                        value={color}
                        className={cn(
                          'flex size-7 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-md border border-gray-200 text-sm text-neutral-600',
                          'data-[selected=true]:bg-gray-100'
                        )}
                        onSelect={() => {
                          if (color) {
                            editor.commands.unsetHighlight();
                            editor.chain().focus().setHighlight({ color }).run();
                          } else {
                            editor.commands.unsetHighlight();
                          }
                          setOpenColor(false);
                        }}
                        style={{ backgroundColor: color }}
                      ></Command.Item>
                    ))}
                  </Command.Group>
                </Command.List>
              </Command>
            }
          >
            <button className={cn('flex h-8 items-center gap-1 rounded-md px-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none')}>
              <span
                className="flex size-6 items-center justify-center rounded-sm border border-gray-200"
                style={{
                  color: activeColorItem?.color || 'inherit',
                  backgroundColor: activeHighlightItem?.color || 'transparent'
                }}
              >
                A
              </span>
              <ChevronDown className="size-4" />
            </button>
          </Popover>
        )}

        {!excludedToolbarItems?.includes('align') && (
          <>
            <Button
              tooltip="Align Left"
              icon={<AlignLeft className="size-4" />}
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign('left').run();
              }}
              isActive={editor.isActive({ textAlign: 'left' })}
            />

            <Button
              tooltip="Align Center"
              icon={<AlignCenter className="size-4" />}
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign('center').run();
              }}
              isActive={editor.isActive({ textAlign: 'center' })}
            />

            <Button
              tooltip="Align Right"
              icon={<AlignRight className="size-4" />}
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign('right').run();
              }}
              isActive={editor.isActive({ textAlign: 'right' })}
            />
          </>
        )}

        {!excludedToolbarItems?.includes('undo') && (
          <>
            <Button
              className="ml-auto"
              tooltip="Undo"
              icon={<Undo className="size-4" />}
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().undo().run();
              }}
              isActive={editor.isActive('undo')}
            />

            <Button
              tooltip="Redo"
              icon={<Redo className="size-4" />}
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().redo().run();
              }}
              isActive={editor.isActive('redo')}
            />
          </>
        )}
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
    <button
      {...props}
      className={cn(
        'flex size-8 items-center justify-center rounded-md text-white outline-none',
        isActive ? 'bg-gray-700 p-2 text-white' : 'text-gray-500',
        className
      )}
    >
      {icon}
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip
        className="rounded-md border-gray-200 bg-gray-50 shadow-none"
        content={<div className="px-2 py-1 text-xs text-gray-500">{tooltip}</div>}
      >
        {element}
      </Tooltip>
    );
  }

  return element;
}
