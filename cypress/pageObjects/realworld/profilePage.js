class ProfilePage {
    visit(username) {
        cy.visit(`https://demo.realworld.io/#/profile/${username}`);
    }

    visitSettings() {
        cy.visit('https://demo.realworld.io/#/settings');
    }

    getFollowButton() {
        return cy.get('.btn-outline-secondary').contains('Follow');
    }

    getUnfollowButton() {
        return cy.get('.btn-secondary').contains('Unfollow');
    }

    followUser() {
        this.getFollowButton().click();
    }

    unfollowUser() {
        this.getUnfollowButton().click();
    }

    getMyArticlesTab() {
        return cy.contains('.nav-link', 'My Articles');
    }

    getFavoritedArticlesTab() {
        return cy.contains('.nav-link', 'Favorited Articles');
    }

    clickMyArticles() {
        this.getMyArticlesTab().click();
    }

    clickFavoritedArticles() {
        this.getFavoritedArticlesTab().click();
    }

    // Settings page methods
    getImageUrlInput() {
        return cy.get('input[placeholder="URL of profile picture"]');
    }

    getUsernameInputSettings() {
        return cy.get('input[placeholder="Username"]');
    }

    getBioInput() {
        return cy.get('textarea[placeholder="Short bio about you"]');
    }

    getEmailInput() {
        return cy.get('input[placeholder="Email"]');
    }

    getPasswordInput() {
        return cy.get('input[placeholder="New Password"]');
    }

    updateSettings(settings) {
        this.visitSettings();
        
        if (settings.imageUrl) {
            this.getImageUrlInput().clear().type(settings.imageUrl);
        }
        if (settings.username) {
            this.getUsernameInputSettings().clear().type(settings.username);
        }
        if (settings.bio) {
            this.getBioInput().clear().type(settings.bio);
        }
        if (settings.email) {
            this.getEmailInput().clear().type(settings.email);
        }
        if (settings.password) {
            this.getPasswordInput().type(settings.password);
        }
        
        cy.contains('button', 'Update Settings').click();
    }

    logout() {
        this.visitSettings();
        cy.contains('button', 'Or click here to logout').click();
    }
}

export default new ProfilePage();
