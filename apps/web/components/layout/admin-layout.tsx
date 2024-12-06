'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger
} from '@repo/ui';

import { logoutAction } from '@/app/dashboard/actions';
import {
  Activity,
  Bolt,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Settings2,
  SquareTerminal,
  Trash2,
  Workflow
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const data = {
  workspace: [
    {
      name: 'Amce Inc',
      describe: 'Admin Management',
      logo: GalleryVerticalEnd,
      url: '/dashboard'
    },
    {
      name: 'Synergy',
      describe: 'HR Management',
      logo: PieChart,
      url: '/synergy'
    },
    {
      name: 'Catalyst',
      describe: 'Marketing & Sales',
      logo: Workflow,
      url: '/catalyst'
    }
  ],
  users: [
    {
      name: 'Activity',
      logo: Activity,
      plan: 'Enterprise'
    },
    {
      name: 'Integrations.',
      logo: Workflow,
      plan: 'Startup'
    },
    {
      name: 'Settings',
      logo: Bolt,
      plan: 'Free'
    }
  ],
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#'
        },
        {
          title: 'Starred',
          url: '#'
        },
        {
          title: 'Settings',
          url: '#'
        }
      ]
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#'
        },
        {
          title: 'Explorer',
          url: '#'
        },
        {
          title: 'Quantum',
          url: '#'
        }
      ]
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#'
        },
        {
          title: 'Get Started',
          url: '#'
        },
        {
          title: 'Tutorials',
          url: '#'
        },
        {
          title: 'Changelog',
          url: '#'
        }
      ]
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#'
        },
        {
          title: 'Team',
          url: '#'
        },
        {
          title: 'Billing',
          url: '#'
        },
        {
          title: 'Limits',
          url: '#'
        }
      ]
    }
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map
    }
  ]
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-gray-100">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-800 text-white">
                      <GalleryVerticalEnd className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium text-gray-800">Amce Inc</span>
                      <span className="truncate text-xs text-gray-500">Admin Management</span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-60 space-y-1 rounded-xl p-2"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  {data.workspace.map((item, index) => (
                    <DropdownMenuItem
                      key={item.name}
                      onClick={() => null}
                      className="cursor-pointer gap-3 rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    >
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg border border-gray-200">
                        <item.logo className="size-4" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium text-gray-800">{item.name}</span>
                        <span className="truncate text-xs text-gray-500">{item.describe}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>PLATFORM</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>PROJECTS</SidebarGroupLabel>
            <SidebarMenu>
              {data.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 rounded-lg" side="right" align="start">
                      <DropdownMenuItem>
                        <Folder className="text-gray-500" />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Forward className="text-gray-500" />
                        <span>Share Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2 className="text-gray-500" />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-600">
                  <MoreHorizontal className="text-gray-600" />
                  <span>More</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-gray-100">
                    <div className="flex items-center justify-center">
                      <Image
                        src="/sophia.png"
                        alt="Profile picture"
                        width={32}
                        height={32}
                        className="border-1 aspect-square size-8 rounded-full border-gray-200 bg-yellow-100"
                      />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium text-gray-800">{session?.user?.name}</span>
                      <span className="truncate text-xs text-gray-500">{session?.user?.email}</span>
                    </div>
                    <ChevronRight className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-60 rounded-xl p-2"
                  align="end"
                  side="right"
                  sideOffset={15}
                  alignOffset={0}
                >
                  <div className="flex items-center gap-2 p-2">
                    <span className="flex-1 truncate text-xs text-gray-600">
                      You login with role: <span className="font-medium text-gray-800">{session?.user?.role}</span>
                    </span>
                  </div>
                  <DropdownMenuSeparator />
                  {data.users.map((team, index) => (
                    <DropdownMenuItem
                      key={team.name}
                      onClick={() => null}
                      className="my-1 cursor-pointer gap-2 rounded-md p-2 text-gray-600 hover:text-gray-800"
                    >
                      <team.logo className="size-4" />
                      <span className="truncate text-sm">{team.name}</span>
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutAction} className="cursor-pointer gap-2 rounded-md p-2 text-gray-800 hover:text-red-700">
                    <LogOut className="size-4" />
                    <span className="truncate text-sm">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <SidebarTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
