import { Box, styled } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import CardViewer from "./card/CardViewer";
import CategoryViewer from "./category/CategoryViewer";
import { Context } from "./Context";
import CardController from "./controller/controller-footer";
import { useHttpClient } from "./shared/hooks/http-hook";

export type categoryType = {
  id: number;
  title: string;
  cardList: number[];
  createdAt: number;
  updatedAt: number;
};

export type cardType = {
  id: number;
  title: string;
  description: string;
  code: string;
  categoryId: number;
  createdAt: number;
  updatedAt: number;
};

const Homepage = (): JSX.Element => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const context = useContext(Context);
  context.setLoading(isLoading);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(-1);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
  const [categories, setCategories] = useState<categoryType[]>([]);
  const [card, setCard] = useState<cardType | null>(null);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const responseData = await sendRequest("/api/category", "GET");

        const newCategories: categoryType[] = [];
        for (const cate of responseData.category) {
          if (cate.title !== "trash" && cate.title !== "draft") {
            newCategories.push({
              id: cate?.id,
              title: cate?.title,
              cardList: cate?.cardList,
              createdAt: new Date(cate.createdAt).getTime(),
              updatedAt: new Date(cate.updatedAt).getTime(),
            });
          }
        }
        setCategories(newCategories);
      } catch (err) {
        context.displayNotification(false);
        context.setNotification("Cannot access category list", "error");
        context.displayNotification(true);
      }
    };
    getCategory();
  }, []);

  useEffect(() => {
    const getCardById = async (cardId: number | undefined) => {
      if (cardId) {
        try {
          const response = await sendRequest(`/api/card/${cardId}`, "GET");
          setCard({
            id: response.id,
            categoryId: response.categoryId,
            title: response.title,
            description: response.description,
            code: response.code,
            createdAt: response.createdAt,
            updatedAt: response.updatedAt,
          });
        } catch (err: any) {
          setCard(null);
          context.displayNotification(false);
          context.setNotification(
            err.message || "Cannot access category list",
            "error"
          );
          context.displayNotification(true);
        }
      }
    };
    setCard(null);
    let cardId,
      cardIndex = selectedCardIndex;
    if (selectedCategoryId === -1) {
      for (const cat of categories) {
        if (cat.cardList.length <= cardIndex) cardIndex -= cat.cardList.length;
        else {
          cardId = cat.cardList[cardIndex];
          break;
        }
      }
    }

    getCardById(
      selectedCategoryId === -1
        ? cardId
        : categories.find((cat) => cat.id === selectedCategoryId)?.cardList[
            selectedCardIndex
          ]
    );
  }, [selectedCardIndex, selectedCategoryId, categories]);

  return (
    <HomepageStyle>
      <CategoryViewer
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelect={(newCatId: number) => {
          setSelectedCardIndex(0);
          setSelectedCategoryId(newCatId);
        }}
      />
      <CardViewer card={card} />
      <CardController
        numberOfCard={
          selectedCategoryId !== -1
            ? categories.find((cat) => cat.id === selectedCategoryId)?.cardList
                .length!
            : categories.reduce((accu, curr) => accu + curr.cardList.length, 0)
        }
        selectedCardIndex={selectedCardIndex}
        changeSelectedCardIndex={setSelectedCardIndex}
      />
    </HomepageStyle>
  );
};

export default Homepage;

const HomepageStyle = styled(Box)({
  position: "fixed",
  top: "60px",
  width: "100vw",
  height: `calc(100vh - 60px)`,
});
