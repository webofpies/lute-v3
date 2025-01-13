import { memo, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Accordion, Divider, Menu, Stack, Text } from "@mantine/core";
import BookmarksButton from "./BookmarksButton";
import BookmarkButton from "./BookmarkButton";
import { scrollSentenceIntoView } from "../../misc/utils";

function BookmarksMenu({ data }) {
  const params = useParams();
  const location = useLocation();
  const currentPage = Number(params.page);

  const bookmarkCount = Object.values(data).reduce(
    (acc, current) => acc + current.length,
    0
  );
  const pageCount = Object.keys(data).length;

  useEffect(() => {
    if (location.state?.id) {
      const textitems = scrollSentenceIntoView(location.state.id);
      Array.from(textitems).forEach((t) => t.classList.add("bookmarked")); // class is removed with mouseOut
    }
  }, [location]);

  return (
    <Menu trigger="click" position="bottom-start" withArrow>
      <Menu.Target>
        <BookmarksButton />
      </Menu.Target>

      <Menu.Dropdown p={0}>
        <Text
          p="xs"
          fz="sm"
          ta="center">{`${bookmarkCount} bookmarks in ${pageCount} page(s)`}</Text>
        <Divider />
        <Accordion
          variant="filled"
          defaultValue={String(currentPage)}
          miw={220}
          disableChevronRotation>
          {Object.entries(data).map(([bookmarkPage, bookmarks]) => (
            <Accordion.Item key={bookmarkPage} value={String(bookmarkPage)}>
              <Accordion.Control fz="xs">{`Page ${bookmarkPage}`}</Accordion.Control>
              <Accordion.Panel>
                <Stack gap={5} align="center">
                  {bookmarks.map((bookmark) => (
                    <BookmarkButton
                      key={bookmark.id}
                      id={bookmark.id}
                      page={bookmarkPage}
                      description={bookmark.description}
                    />
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Menu.Dropdown>
    </Menu>
  );
}

export default memo(BookmarksMenu);
