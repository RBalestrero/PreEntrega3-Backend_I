document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", async (event) => {
    try {
      // Verifica si el clic ocurrió en un botón con la clase "view-product"
      if (event.target.classList.contains("view-product")) {
        const id = event.target.dataset.id; // Obtener el ID del producto
        console.log("Se hizo clic en el botón con ID:", id);

        // Aquí puedes llamar a una función para eliminar el producto
        const response = await fetch(
          `http://localhost:8080/api/products/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        const data = await response.json();

        // const response2 = await fetch(`http://localhost:8080/product`,{
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //     "Accept": "application/json",
        //   },
        //   body: JSON.stringify({
        //     title,
        //     description,
        //     code,
        //     category,
        //     price,
        //     stock,
        //     thumbnail,
        //     _id
        //   })
        // })
        // const data2 = await response2.json();



        const { title, description, code, category, price, stock, thumbnail, _id } = data.payload;
        document.getElementById("productos").innerHTML = `
        <div class="card">
          <div class="card-body">
            <img class="imagen" src="/static/${thumbnail}" alt="thumbnail">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${description}</p>
            <p class="card-text">Código: ${code}</p>
            <p class="card-text">${category}</p>
            <p class="card-text">${price}</p>
            <p class="card-text">${stock} Unidades</p>
            <button class="view-product" data-id="${_id}">Ver producto</button>
            <button class="add-cart" onclick="addToCart(${_id})">Añadir al carrito</button>
          </div>
        </div>`;
      }
    } catch (error) {
      console.log(error);
    }
  });
});
