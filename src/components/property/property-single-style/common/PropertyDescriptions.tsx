import {createSlateEditor} from "platejs";
import {PlateStatic} from "platejs/static";
import {BaseEditorKit} from "@/components/editor/editor-base-kit";

type Props = {
  description: string
}

const PropertyDescriptions = ({ description }: Props) => {

  const editor = createSlateEditor({
    plugins: BaseEditorKit,
    value: JSON.parse(description),
  });

  return (
    <PlateStatic editor={editor} />
  );
};

export default PropertyDescriptions;
