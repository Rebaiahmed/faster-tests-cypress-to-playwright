class HomePage {
    visit() {
        cy.visit('https://demo.realworld.io/#/');
    }

    getGlobalFeedTab() {
        return cy.contains('.nav-link', 'Global Feed');
    }

    getYourFeedTab() {
        return cy.contains('.nav-link', 'Your Feed');
    }

    getArticlePreview(index = 0) {
        return cy.get('.article-preview').eq(index);
    }

    clickArticle(index = 0) {
        this.getArticlePreview(index).find('h1').click();
    }

    getPopularTags() {
        return cy.get('.tag-list a');
    }

    clickTag(tagName) {
        cy.get('.tag-list').contains(tagName).click();
    }

    favoriteArticle(index = 0) {
        this.getArticlePreview(index).find('.btn-outline-primary').click();
    }

    verifyArticleCount(minCount = 1) {
        cy.get('.article-preview').should('have.length.at.least', minCount);
    }
}

export default new HomePage();
