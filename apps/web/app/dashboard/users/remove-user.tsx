import { Dispatch, SetStateAction } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { Button, Modal } from '@repo/ui';

import { mutatePrefix } from '@/lib/swr/mutate';
import { removeUserAction } from './actions';

type RemoveUserProps = {
  isDeleteOpen: boolean;
  setIsDeleteOpen: Dispatch<SetStateAction<boolean>>;
  email: string;
  userId: string;
};

export default function RemoveUser({ isDeleteOpen, setIsDeleteOpen, email, userId }: RemoveUserProps) {
  const { execute, isExecuting } = useAction(removeUserAction, {
    onSuccess: () => {
      toast.success('User deleted successfully');
      mutatePrefix('/api/auth/admin/list-users');
      setIsDeleteOpen(false);
    },
    onError: ({ error }) => {
      toast.error(error?.serverError || 'Failed to delete user');
    }
  });

  return (
    <Modal showModal={isDeleteOpen} setShowModal={setIsDeleteOpen}>
      <div className="flex flex-col gap-4 p-6">
        <h1 className="text-base font-medium">Delete User</h1>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-semibold text-gray-700">{email}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" text="Cancel" className="w-fit" onClick={() => setIsDeleteOpen(false)} />
          <Button loading={isExecuting} variant="danger" className="w-fit" text="Delete" onClick={() => execute({ userId: userId })} />
        </div>
      </div>
    </Modal>
  );
}
