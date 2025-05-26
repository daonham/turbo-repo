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
  SidebarProvider
} from '@repo/ui';

import { authClient } from '@/lib/auth/client';
import {
  Activity,
  Bolt,
  ChevronRight,
  ChevronsUpDown,
  ClipboardMinus,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  House,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Settings2,
  Trash2,
  Users,
  Workflow
} from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment } from 'react';

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
  platform: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: House,
      isActive: true
    },
    {
      title: 'Posts',
      url: '/dashboard/posts',
      icon: ClipboardMinus,
      items: [
        {
          title: 'All posts',
          url: '/dashboard/posts'
        },
        {
          title: 'Add new',
          url: '/dashboard/posts/add'
        },
        {
          title: 'Tags',
          url: '/dashboard/posts/tags'
        }
      ]
    },
    {
      title: 'Users',
      url: '/dashboard/users',
      icon: Users,
      items: [
        {
          title: 'All Users',
          url: '/dashboard/users'
        },
        {
          title: 'Add new',
          url: 'dashboard/users/add'
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

export default function AdminLayout({ defaultOpen, user, children }: { defaultOpen: boolean; user: any; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
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
              {data.platform.map((item) => (
                <Fragment key={item.title}>
                  <>
                    {item.items ? (
                      <Collapsible key={item.title} asChild defaultOpen={pathname.startsWith(item.url)} className="group/collapsible">
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title} isActive={pathname.startsWith(item.url)}>
                              {item.icon && <item.icon />}
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
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
                    ) : (
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip={item.title} asChild isActive={pathname === item.url}>
                          <a href={item.url}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </>
                </Fragment>
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
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-gray-100 group-data-[collapsible=icon]:rounded-full">
                    <div className="aspect-square size-8">
                      <Image
                        className="border-1 size-full rounded-full border-gray-200 bg-yellow-100 object-cover object-center"
                        src={user?.image || '/sophia.png'}
                        alt={user?.name || 'Profile picture'}
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium text-gray-800">{user?.name}</span>
                      <span className="truncate text-xs text-gray-500">{user?.email}</span>
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
                      You login with role: <span className="font-medium text-gray-800">{user?.role}</span>
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
                  <DropdownMenuItem
                    onClick={async () =>
                      await authClient.signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            router.push('/login'); // redirect to login page
                          }
                        }
                      })
                    }
                    className="cursor-pointer gap-2 rounded-md p-2 text-red-600 hover:bg-gray-200"
                  >
                    <LogOut className="size-4" />
                    <span className="truncate text-sm">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
