import ePub from 'epubjs';
import Hammer from 'hammerjs'; // Importa a biblioteca Hammer.js
import './style.css';

let rendition;
document.addEventListener("DOMContentLoaded", async () => {
    const book = ePub("../books/ebook.epub");
    rendition = book.renderTo("book-viewer", {
        width: "100%",
        height: "100%",
        allowScriptedContent: true
    });

    await rendition.display();

    // Mostra o botão apenas na página 7
    rendition.on('rendered', (section) => {
        const watchVideoBtn = document.getElementById('watchVideoBtn');
        if (section.index === 6) { // As seções começam do índice 0
            watchVideoBtn.style.display = "block";
        } else {
            watchVideoBtn.style.display = "none";
        }
    });

    // Redireciona para o YouTube ao clicar no botão
    document.getElementById('watchVideoBtn').addEventListener("click", function() {
        window.open("https://www.youtube.com/watch?v=Fa4ctd1uxNc", "_blank");
    });

    // Navegação por botões
    document.getElementById('next').addEventListener('click', () => rendition.next());
    document.getElementById('prev').addEventListener('click', () => rendition.prev());

    // Navegação por swipe dentro do contêiner do livro
    const viewer = document.getElementById("book-viewer");

    // Configuração do Hammer.js dentro do contêiner do livro
    const mc = new Hammer.Manager(viewer);
    mc.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL }));

    mc.on("swipeleft", function() {
        rendition.next();
    });
    
    mc.on("swiperight", function() {
        rendition.prev();
    });

    // Criação do sumário
    const navList = document.createElement('ul');
    navList.classList.add('nav-list');
    renderNavItems(book.navigation.toc, navList); // Supondo que o sumário está em book.navigation.toc
    document.body.appendChild(navList);
});

// Função para renderizar itens de navegação
function renderNavItems(items, parentElement) {
    items.forEach(item => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = item.label;
        link.href = item.href;
        link.addEventListener('click', function(event) {
            event.preventDefault();
            rendition.display(item.href); // Exibir o item clicado
        });
        listItem.appendChild(link);

        if (item.subitems.length > 0) {
            const subList = document.createElement('ul');
            renderNavItems(item.subitems, subList);
            listItem.appendChild(subList);
        }

        parentElement.appendChild(listItem);
    });
}

