import { Box, Link } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

export function BackToTopFooter() {
  // click to go back to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      as="footer"
      width="100%"
      py="1"
      bg="gray.100"
      textAlign="center"
      position="fixed"
      bottom="0"
    >
      <Link onClick={scrollToTop} cursor="pointer" color="blue.500">
        Go back to the top
      </Link>
    </Box>
  );
}

interface MasonryProps {
  children: React.ReactNode[];
  columns: number;
  gap: number;
}

export const Masonry: React.FC<MasonryProps> = ({ children, columns, gap }) => {
  // set the column layout of the masonry page
  const [columnWrappers, setColumnWrappers] = useState<React.ReactNode[][]>(
    Array.from({ length: columns }, () => [])
  );
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const columnWrappers: React.ReactNode[][] = Array.from(
      { length: columns },
      () => []
    );

    React.Children.forEach(children, (child, index) => {
      columnWrappers[index % columns].push(child);
      // columnWrappers[getShortestColumnIndex()].push(child);
    });

    setColumnWrappers(columnWrappers);
  }, [children, columns]);

  return (
    <Box
      className="masonry-grid"
      style={{ marginLeft: -gap }}
      justifyContent="center" // Centers items horizontally
      display="flex"
    >
      {columnWrappers.map((column, index) => (
        <div
          className="masonry-grid_column"
          key={index}
          style={{ paddingLeft: gap }}
          ref={(el) => {
            columnRefs.current[index] = el;
          }}
        >
          {column.map((child, i) => (
            <div
              key={i}
              className="masonry-card"
              style={{ marginBottom: gap, padding: gap }}
            >
              {child}
            </div>
          ))}
        </div>
      ))}
    </Box>
  );
};
