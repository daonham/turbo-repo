import { CirclePlus } from 'lucide-react';
import { Combobox, ComboboxOption } from '@repo/ui';
import { cn } from '@repo/utils';

const ROLES: ComboboxOption[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' }
];

export default function RoleOptions({ role, setRole }: { role: string | null; setRole: (role: string | null) => void }) {
  return (
    <Combobox
      selected={ROLES.find((r) => role === r.value) || null}
      setSelected={(r: ComboboxOption | null) => setRole(r?.value || null)}
      options={ROLES}
      icon={<CirclePlus className="size-4 shrink-0" />}
      hideSearch
      buttonProps={{
        className: cn('py-2 px-3 h-auto w-fit text-sm font-medium text-gray-700 hover:bg-gray-100')
      }}
      optionClassName="w-full min-w-30"
    >
      <span className="text-sm font-medium">
        Role{role && <span className="text-gray-500">: {ROLES.find((r) => r.value === role)?.label || 'Unknown'}</span>}
      </span>
    </Combobox>
  );
}
