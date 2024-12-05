import { ScrollArea } from "@mantine/core";
import LanguageCard from "../LanguageCard/LanguageCard";
import classes from "./LanguageCards.module.css";

function LanguageCards({ languages }) {
  return (
    <ScrollArea type="scroll" offsetScrollbars="x">
      <nav>
        <ul className={classes.ul}>
          {languages
            .toSorted((a, b) => a.name.localeCompare(b.name))
            .map((data) => (
              <li key={data.id} className={classes.li}>
                <LanguageCard data={data} />
              </li>
            ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}

export default LanguageCards;
