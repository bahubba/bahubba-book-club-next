'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';

import SubmitButton from '@/components/buttons/submit.button';
import { handleUpdateMemberRole } from '@/api/form-handlers/membership-form.handlers';
import { Role } from '@/db/models/nodes';
import { ErrorFormState } from '@/api/form-handlers/state-interfaces';

// Component props
interface MemberRoleFormProps {
  bookClubSlug: string;
  email: string;
  memberEmail: string;
  adminRole: Role;
  role: Role;
}

/**
 * Form for updating a member's role in a book club
 *
 * @prop {Object} props Component props
 * @prop {string} props.bookClubSlug The slug of the book club
 * @prop {string} props.email The email of the current user
 * @prop {string} props.memberEmail The email of the member whose role is being updated
 * @prop {Role} props.adminRole The role of the current user
 * @prop {Role} props.role The current role of the user being updated
 */
const MemberRoleForm = ({
  bookClubSlug,
  email,
  memberEmail,
  role
}: Readonly<MemberRoleFormProps>) => {
  // Form state
  const [formState, formAction] = useFormState(handleUpdateMemberRole, {
    error: ''
  } as ErrorFormState);

  // Role state
  const [selectedRole, setSelectedRole] = useState(role);

  // Handle selecting a new role
  const handleSelectRole = ({
    target: { value }
  }: React.ChangeEvent<HTMLSelectElement>) => setSelectedRole(value as Role);

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-y-1">
        {formState.error && <p className="text-red-500">* {formState.error}</p>}
        <div className="flex justify-between gap-x-1">
          <Input
            className="hidden"
            name="slug"
            value={bookClubSlug}
          />
          <Input
            className="hidden"
            name="email"
            value={memberEmail}
          />
          <Select
            label="Role"
            name="role"
            selectedKeys={[selectedRole]}
            onChange={handleSelectRole}
            isDisabled={email === memberEmail || role === Role.OWNER}
          >
            {Object.values(Role).map(roleVal => (
              <SelectItem
                key={roleVal}
                value={roleVal}
              >
                {roleVal}
              </SelectItem>
            ))}
          </Select>
          {role !== selectedRole && <SubmitButton buttonText="Update" />}
        </div>
      </div>
    </form>
  );
};

export default MemberRoleForm;
