import { Box, BoxProps, styled, Typography } from "@mui/material";
import { categoryType } from "../Homepage";

type propsType = {
  categories: categoryType[];
  selectedCategoryId: number;
  onSelect: (id: number) => void;
};

const CategoryViewer = ({
  categories,
  selectedCategoryId,
  onSelect,
}: propsType): JSX.Element => {
  return (
    <>
      <CategoryViewerStyle>
        <Typography
          variant="h1"
          lineHeight="35px"
          fontWeight="400"
          fontStyle="normal"
          textAlign="center"
          color="#FF6429"
          fontSize="22px"
        >
          CATEGORY
        </Typography>
        <Box
          sx={{
            width: "100%",
            padding: "5px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Card
            isselected={selectedCategoryId === -1 ? 1 : 0}
            onClick={() => onSelect(-1)}
          >
            <Typography fontWeight="400" textAlign="center" fontSize="18px">
              All Category
            </Typography>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Typography fontWeight="400" textAlign="right" fontSize="12px">
                {categories.reduce(
                  (prev, curr) => prev + curr.cardList.length,
                  0
                ) + " items"}
              </Typography>
            </Box>
          </Card>
          {categories.map((cate) => (
            <Card
              key={cate.id}
              isselected={selectedCategoryId === cate.id ? 1 : 0}
              onClick={() => onSelect(cate.id)}
            >
              <Typography
                fontWeight="400"
                textAlign="center"
                fontSize="18px"
                sx={{
                  wordWrap: "break-word",
                  maxWidth: "100%",
                }}
              >
                {cate.title}
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Typography fontWeight="400" textAlign="right" fontSize="12px">
                  {cate.cardList.length + " items"}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      </CategoryViewerStyle>
    </>
  );
};

export default CategoryViewer;

const CategoryViewerStyle = styled(Box)({
  position: "fixed",
  top: "45px",
  right: "0px",
  width: "300px",
  height: `calc(100vh - 100px)`,
  backgroundColor: "#ebf3fa",
  borderLeft: "1px solid #87c7ff",
  padding: "10px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "20px",
  overflow: "hidden",
  overflowY: "auto",
});

interface CustomBoxProps extends BoxProps {
  isselected: number;
}
const Card = styled(Box)<CustomBoxProps>(({ isselected }) => ({
  width: "100%",
  boxSizing: "border-box",
  padding: "5px 10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#E1ECF5",
  borderRadius: "8px",
  boxShadow: `${isselected ? "0px 0px 6px 2px #BFD5E9" : "none"}`,
  color: `${isselected ? "#FF6429" : "inherit"}`,

  "&:hover": {
    backgroundColor: "#E1ECF5",
    boxShadow: "0px 0px 6px 2px #BFD5E9",
  },
  cursor: "pointer",
  gap: "5px",
}));
