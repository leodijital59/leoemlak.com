import {createSlateEditor} from "platejs";
import {PlateStatic} from "platejs/static";

type Props = {
  description: string
}

const ProperytyDescriptions = ({ description }: Props) => {

  const editor = createSlateEditor({
    plugins: [], // Add your base plugins
    value: JSON.parse(description),
  });

  return (
    <div className="text mb10">
      <PlateStatic editor={editor}/>
    </div>
  );
};

export default ProperytyDescriptions;
