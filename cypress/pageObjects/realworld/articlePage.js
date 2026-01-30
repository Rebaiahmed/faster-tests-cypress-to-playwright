class ArticlePage {
    visitNewArticle() {
        cy.visit('https://demo.realworld.io/#/editor');
    }

    getTitleInput() {
        return cy.get('input[placeholder="Article Title"]');
    }

    getDescriptionInput() {
        return cy.get('input[placeholder="What\'s this article about?"]');
    }

    getBodyInput() {
        return cy.get('textarea[placeholder="Write your article (in markdown)"]');
    }

    getTagsInput() {
        return cy.get('input[placeholder="Enter tags"]');
    }

    getPublishButton() {
        return cy.contains('button', 'Publish Article');
    }

    createArticle(title, description, body, tags = []) {
        this.visitNewArticle();
        this.getTitleInput().type(title);
        this.getDescriptionInput().type(description);
        this.getBodyInput().type(body);
        
        tags.forEach(tag => {
            this.getTagsInput().type(tag + '{enter}');
        });
        
        this.getPublishButton().click();
    }

    getArticleTitle() {
        return cy.get('h1');
    }

    getArticleBody() {
        return cy.get('.article-content');
    }

    deleteArticle() {
        cy.contains('button', 'Delete Article').click();
    }

    editArticle() {
        cy.contains('a', 'Edit Article').click();
    }

    favoriteArticle() {
        cy.get('.btn-outline-primary').contains('Favorite').click();
    }

    followAuthor() {
        cy.get('.btn-outline-secondary').contains('Follow').click();
    }

    addComment(comment) {
        cy.get('textarea[placeholder="Write a comment..."]').type(comment);
        cy.contains('button', 'Post Comment').click();
    }

    deleteComment(index = 0) {
        cy.get('.card').eq(index).find('.ion-trash-a').click();
    }

    getComments() {
        return cy.get('.card');
    }
}

export default new ArticlePage();
