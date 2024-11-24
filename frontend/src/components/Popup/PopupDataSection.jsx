import { Pill, PillGroup } from "@mantine/core";
import classes from "./PopupData.module.css";

function PopupDataSection({ data }) {
  return (
    <tbody>
      {data.map((p, index) => (
        <tr key={index}>
          <td className={classes.td}>
            <p className={classes.term}>{p.term}</p>
            {p.roman && <em>{p.roman}</em>}
          </td>
          <td className={classes.td}>
            <span>{p.trans}</span>
            <PillGroup>
              {p.tags.map((tag) => (
                <Pill key={tag}>{tag}</Pill>
              ))}
            </PillGroup>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default PopupDataSection;
