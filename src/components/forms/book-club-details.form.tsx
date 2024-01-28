import { useFormState } from 'react-dom';
import { Input } from '@nextui-org/input';
import { Radio, RadioGroup } from '@nextui-org/radio';

/** Form for creating or updating a book club's details */
const BookClubDetailsForm = () => {


  return (
    <form>
      <Input
        label="Name"
        placeholder="Book Club Name"
        required
      />
      <Input
        label="Description"
        placeholder="Book Club Description"
        required
      />
      <Input
        label="Image"
        placeholder="Book Club Image"
      />
      <RadioGroup
        label="Publicity"
        orientation="horizontal"
      >
        <Radio value="PUBLIC">Public</Radio>
        <Radio value="OBSERVABLE">Observable</Radio>
        <Radio value="PRIVATE">Private</Radio>
      </RadioGroup>
    </form>
  )
}

export default BookClubDetailsForm;