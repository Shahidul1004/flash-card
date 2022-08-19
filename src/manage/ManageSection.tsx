import {
  styled,
  Box,
  BoxProps,
  Button,
  IconButton,
  Menu,
  ListItem,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../Context";
import { cardType, categoryType } from "../Homepage";
import { useHttpClient } from "../shared/hooks/http-hook";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import AddIcon from "@mui/icons-material/Add";
import CreateCategoryModal from "../modal/CreateCategoryModal";
import _ from "lodash";
import DeleteCategoryModal from "../modal/DeleteCategoryModal";
import DeleteCardModal from "../modal/DeleteCardModal";
import ManageCard from "./ManageCard";

const ManageSection = (): JSX.Element => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const context = useContext(Context);
  const [categories, setCategories] = useState<categoryType[]>([]);
  const [cards, setCards] = useState<cardType[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();

  const [showCreateCategoryModal, setShowCreateCategoryModal] =
    useState<boolean>(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] =
    useState<boolean>(false);
  const [showDeleteCardModal, setShowDeleteCardModal] =
    useState<boolean>(false);
  const [showCreateCardModal, setShowCreateCardModal] =
    useState<boolean>(false);

  const modalCategory = useRef<categoryType | null>(null);
  const modalCard = useRef<cardType | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const getAllCategory = async () => {
    try {
      const responseData = await sendRequest("/api/category", "GET");
      const newCategories: categoryType[] = [];
      for (const cate of responseData.category) {
        newCategories.push({
          id: cate?.id,
          title: cate?.title,
          cardList: cate?.cardList,
          createdAt: new Date(cate.createdAt).getTime(),
          updatedAt: new Date(cate.updatedAt).getTime(),
        });
      }
      setCategories(newCategories);
    } catch (err) {
      context.displayNotification(false);
      context.setNotification("Cannot access category list", "error");
      context.displayNotification(true);
    }
  };

  const getCardByCategoryId = async () => {
    if (selectedCategoryId !== -1) {
      try {
        const cardByCategoryId: cardType[] = await sendRequest(
          `/api/card/category/${selectedCategoryId}`,
          "GET"
        );
        const newCards: cardType[] = [];
        for (const card of cardByCategoryId) {
          newCards.push({
            id: card?.id,
            title: card?.title,
            description: card.description,
            code: card.code,
            categoryId: card.categoryId,
            createdAt: new Date(card.createdAt).getTime(),
            updatedAt: new Date(card.updatedAt).getTime(),
          });
        }
        setCards(newCards);
      } catch (err: any) {
        context.displayNotification(false);
        context.setNotification(
          err.message || "Cannot access category list",
          "error"
        );
        context.displayNotification(true);
      }
    } else {
      setCards([]);
    }
  };

  const onHandleMoveTo = async (categoryId: number) => {
    handleClose();
    try {
      await sendRequest(
        `/api/card/${modalCard.current!.id}`,
        "PATCH",
        JSON.stringify({
          ...modalCard.current,
          categoryId: categoryId,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      context.displayNotification(false);
      context.setNotification("Card moved to trash", "success");
      context.displayNotification(true);
      setCards((prev) => {
        const prevCopy = _.cloneDeep(prev);
        const index = prevCopy.findIndex(
          (card) => card.id === modalCard.current?.id
        );
        prevCopy.splice(index, 1);
        return prevCopy;
      });
    } catch (err: any) {
      context.displayNotification(false);
      context.setNotification(err?.message || "something went wrong", "error");
      context.displayNotification(true);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);
  useEffect(() => {
    getCardByCategoryId();
  }, [selectedCategoryId]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Page>
        <Container>
          <DataViewer>
            <Title>
              <Typography fontSize="17px" fontWeight="500">
                Category
              </Typography>
              <Typography fontSize="17px" fontWeight="500">
                Search
              </Typography>
            </Title>
            <List>
              {categories
                .filter((cat) => cat.title !== "trash" && cat.title !== "draft")
                .concat(
                  categories.filter(
                    (cat) => cat.title === "draft" || cat.title === "trash"
                  )
                )
                .map((category) => (
                  <Listitem
                    key={category.id}
                    active={category.id === selectedCategoryId ? 1 : 0}
                  >
                    <ItemName
                      onClick={() => setSelectedCategoryId(category.id)}
                    >
                      {category.title}
                    </ItemName>
                    <IconButton
                      sx={{
                        padding: "5px",
                        color: "inherit",
                      }}
                      onClick={() => {
                        modalCategory.current = category;
                        setShowCreateCategoryModal(true);
                      }}
                      disabled={
                        category.title === "trash" || category.title === "draft"
                      }
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      sx={{
                        padding: "5px",
                        color: "inherit",
                      }}
                      onClick={() => {
                        modalCategory.current = category;
                        setShowDeleteCategoryModal(true);
                      }}
                      disabled={
                        category.title === "trash" || category.title === "draft"
                      }
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Listitem>
                ))}
            </List>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={() => {
                modalCategory.current = null;
                setShowCreateCategoryModal(true);
              }}
            >
              Add Category
            </Button>
          </DataViewer>
          <DataViewer width="500px">
            <Title>
              <Typography fontSize="17px" fontWeight="500">
                Card
              </Typography>
              <Typography fontSize="17px" fontWeight="500">
                Search
              </Typography>
            </Title>
            <List>
              {cards.map((card) => (
                <Listitem key={card.id} active={0}>
                  <ItemName
                    sx={{ width: "375px" }}
                    onClick={() => {
                      modalCard.current = card;
                      setShowCreateCardModal(true);
                    }}
                  >
                    {card.title}
                  </ItemName>
                  <IconButton
                    sx={{
                      padding: "5px",
                      color: "inherit",
                    }}
                    onClick={(event) => {
                      modalCard.current = card;
                      handleClick(event);
                    }}
                  >
                    <DriveFileMoveOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    sx={{
                      padding: "5px",
                      color: "inherit",
                    }}
                    onClick={() => {
                      modalCard.current = card;
                      setShowDeleteCardModal(true);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Listitem>
              ))}
            </List>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={() => {
                modalCard.current = null;
                setShowCreateCardModal(true);
              }}
            >
              Add Card
            </Button>
          </DataViewer>
        </Container>
      </Page>
      {showCreateCategoryModal && (
        <CreateCategoryModal
          category={modalCategory.current}
          onClose={() => setShowCreateCategoryModal(false)}
          setCategories={setCategories}
        />
      )}
      {showDeleteCategoryModal && (
        <DeleteCategoryModal
          category={modalCategory.current!}
          onClose={() => setShowDeleteCategoryModal(false)}
          onUpdate={() => {
            if (modalCategory.current?.id === selectedCategoryId) {
              setSelectedCategoryId(undefined);
            }
            setCategories((prev) => {
              const prevCopy = _.cloneDeep(prev);
              const index = prevCopy.findIndex(
                (cat) => cat.id === modalCategory.current?.id
              );
              prevCopy.splice(index, 1);
              return prevCopy;
            });
            setShowDeleteCategoryModal(false);
          }}
        />
      )}
      {showDeleteCardModal && (
        <DeleteCardModal
          category={categories.find((cat) => cat.id === selectedCategoryId)!}
          trashCategoryId={categories.find((cat) => cat.title === "trash")!.id}
          card={modalCard.current!}
          onClose={() => {
            setShowDeleteCardModal(false);
          }}
          onUpdate={() => {
            setCards((prev) => {
              const prevCopy = _.cloneDeep(prev);
              const index = prevCopy.findIndex(
                (card) => card.id === modalCard.current?.id
              );
              prevCopy.splice(index, 1);
              return prevCopy;
            });
            setShowDeleteCardModal(false);
          }}
        />
      )}
      {showCreateCardModal && (
        <ManageCard
          card={
            modalCard.current || {
              id: -1,
              title: "",
              categoryId: categories.find((cat) => cat.title === "draft")?.id!,
              code: "",
              description: "",
              createdAt: 1,
              updatedAt: 1,
            }
          }
          selectedCategoryId={selectedCategoryId}
          categories={categories}
          setCards={setCards}
          onClose={() => setShowCreateCardModal(false)}
        />
      )}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiPaper-root": {
            width: "270px",
            maxHeight: "200px",
            padding: "5px",
            overflowY: "auto",
            "& .MuiMenu-list": {
              padding: "0",
              overflow: "hidden",
            },
            "& .MuiListItem-root": {
              width: "100%",
              cursor: "pointer",
              margin: "0px",
              wordBreak: "break-word",
              textTransform: "capitalize",
              ":hover": {
                backgroundColor: "ButtonShadow",
              },
            },
          },
        }}
      >
        {categories
          .filter(
            (cat) =>
              cat.title !== "trash" &&
              cat.title !== "draft" &&
              cat.id !== modalCard.current?.categoryId
          )
          .map((cat) => (
            <ListItem key={cat.id} onClick={() => onHandleMoveTo(cat.id)}>
              <Box>{cat.title}</Box>
            </ListItem>
          ))}
      </Menu>
    </>
  );
};

export default ManageSection;

const Page = styled(Box)({
  position: "fixed",
  top: "45px",
  width: "100vw",
  height: "calc(100vh - 45px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const Container = styled(Box)({
  minHeight: "500px",
  maxHeight: "calc(100% - 50px)",
  width: "922px",
  position: "fixed",
  overflow: "hidden",
  borderRadius: "8px",
  border: "1px solid rgb(204, 204, 204)",
  boxSizing: "border-box",
  boxShadow: "grey 0px 0px 8px 2px",
  padding: "20px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "50px",
});

interface DataViewerProps extends BoxProps {
  width?: string;
}
const DataViewer = styled(Box)<DataViewerProps>(({ width }) => ({
  boxSizing: "border-box",
  width: `${width ? width : "330px"}`,
  maxHeight: "calc(100vh - 140px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
}));

const List = styled(Box)({
  width: "100%",
  minHeight: "300px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "10px",
  borderTop: "1px solid rgb(204, 204, 204)",
  boxSizing: "border-box",
  padding: "10px 15px",
  marginBottom: "20px",
  backgroundColor: "rgb(250, 250, 250)",
  overflowY: "auto",
});

interface ListBoxProps extends BoxProps {
  active: number;
}
const Listitem = styled(Box)<ListBoxProps>(({ active }) => ({
  boxSizing: "border-box",
  borderRadius: "4px",
  boxShadow: `${
    active ? "0px 0px 6px 2px #bfd5e9" : "0px 0px 3px 1px #bfd5e9"
  }`,
  padding: "5px 10px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  color: `${active ? "#FF6429" : "inherit"}`,
  backgroundColor: "#eef1f4",
  ":hover": {
    color: "#FF6429",
    boxShadow: "0px 0px 6px 2px #bfd5e9",
  },
}));

const ItemName = styled(Typography)({
  width: "200px",
  fontSize: "18px",
  color: "inherit",
  wordBreak: "break-word",
  lineHeight: "1.5",
  textTransform: "capitalize",
  marginRight: "15px",
  cursor: "pointer",
});

const Title = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#4b4e50",
});
