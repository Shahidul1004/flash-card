import { Box, Button, styled, Typography } from "@mui/material";
import _ from "lodash";
import React, { useContext, useEffect } from "react";
import { Context } from "../Context";
import { cardType, categoryType } from "../Homepage";
import { useHttpClient } from "../shared/hooks/http-hook";

type propTypes = {
  category: categoryType;
  trashCategoryId: number;
  card: cardType;
  onClose: () => void;
  onUpdate: () => void;
};
const DeleteCardModal = ({
  category,
  trashCategoryId,
  card,
  onClose,
  onUpdate,
}: propTypes): JSX.Element => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const context = useContext(Context);
  context.setLoading(isLoading);

  useEffect(() => {
    return () => {
      context.setLoading(false);
    };
  }, []);

  const onSubmitHandler = async () => {
    if (category.title === "trash") {
      try {
        await sendRequest(`/api/card/${card.id}`, "DELETE");
        context.displayNotification(false);
        context.setNotification("Card deleted", "success");
        context.displayNotification(true);
        onUpdate();
      } catch (err: any) {
        context.displayNotification(false);
        context.setNotification(err?.message || "Cannot delete card", "error");
        context.displayNotification(true);
      }
    } else {
      try {
        await sendRequest(
          `/api/card/${card.id}`,
          "PATCH",
          JSON.stringify({
            ...card,
            categoryId: trashCategoryId,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        context.displayNotification(false);
        context.setNotification("Card moved to trash", "success");
        context.displayNotification(true);
        onUpdate();
      } catch (err: any) {
        context.displayNotification(false);
        context.setNotification(
          err?.message || "something went wrong",
          "error"
        );
        context.displayNotification(true);
      }
    }
  };
  return (
    <>
      <OverLay />
      <ModalContainer>
        <Box
          sx={{
            width: "300px",
            display: "flex",
            flexFlow: "column nowrap",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Typography fontWeight="500">Do you want to delete Card?</Typography>

          <Typography>
            {category.title === "trash"
              ? "Card cannot be restored"
              : "Card will be moved to trash"}
          </Typography>

          <Box sx={{ marginTop: "25px", display: "flex", gap: "20px" }}>
            <Button
              variant="outlined"
              color="warning"
              sx={{
                padding: "6px 8px",
              }}
              onClick={onSubmitHandler}
            >
              {category.title === "trash" ? "Delete" : "Move To Trash"}
            </Button>
            <Button
              variant="contained"
              sx={{
                padding: "6px 20px",
              }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </ModalContainer>
    </>
  );
};
export default DeleteCardModal;

const OverLay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  zIndex: 1000,
});

const ModalContainer = styled(Box)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "20px",
  zIndex: 1000,
  borderRadius: "5px",
});
