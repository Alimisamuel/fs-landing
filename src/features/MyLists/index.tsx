"use client";

import CategoryBanner from "@/components/Banners/CategoryBanner";
import React from "react";
import { useUtilsContext } from "@/contexts/UtilsContext";
import MovieCard from "@/components/cards/MovieCard";
import { HomeHeader } from "@/components/header";
import Container from "@/components/UI/Container";
import { Grid } from "@mui/material";
import Footer from "@/components/Sections/Footer";

const MyListPage = () => {
  const { movieList, isLoading, error } = useUtilsContext();

  if (isLoading) {
    return (
      <div>
        <CategoryBanner category="My List" />
        <div className="flex justify-center items-center py-20">
          <div className="text-white text-xl">Loading your list...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <CategoryBanner category="My List" />
        <div className="flex justify-center items-center py-20">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HomeHeader />
      <Container>
        <div className="mt-30 mb-5 ">
          <h3 className="font-medium text-[#E5E5E5] text-[50px] optima">
            My Lists
          </h3>
        </div>
        {movieList?.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-white text-xl">
              Your list is empty. Start adding your favorite videos!
            </div>
          </div>
        ) : (
          <Grid container spacing={2}>
            {movieList?.map((movie) => (
              <Grid size={{ md: 2.5, xs: 6 }} key={movie.id}>
                <MovieCard autoWidth item={movie?.video} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default MyListPage;
