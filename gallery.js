const filterButtons = document.querySelectorAll("[data-filter]");
const galleryItems = document.querySelectorAll("[data-gallery-item]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxDescription = document.querySelector("[data-lightbox-description]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });

    galleryItems.forEach((item) => {
      item.classList.toggle(
        "is-hidden",
        filter !== "all" && item.dataset.category !== filter
      );
    });
  });
});

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = item.dataset.title;
    lightboxDescription.textContent = item.dataset.description;
    lightbox.classList.add("is-open");
    document.body.classList.add("no-scroll");
  });
});

function closeLightbox() {
  lightbox.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
}

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});
