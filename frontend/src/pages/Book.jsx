import { useState } from "react";
import BookView from "../components/BookView/BookView";
import DrawerMenu from "../components/DrawerMenu/DrawerMenu";

function Book() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [themeFormOpen, setThemeFormOpen] = useState(false);

  return (
    <>
      <DrawerMenu
        drawerOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onThemeFormOpen={setThemeFormOpen}
      />
      <BookView
        themeFormOpen={themeFormOpen}
        onDrawerOpen={() => setDrawerOpen(true)}
        onThemeFormOpen={setThemeFormOpen}
      />
    </>
  );
}

export default Book;
