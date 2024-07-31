const testUrl = 'http://localhost:4000';
const mockIngredientId = '643d69a5c3f7b9001cfa093c'
const modalSelector = '[data-cy=modal]';
const modalCloseButtonSelector = '[data-cy=modal-close-button]';
const emptyConstructor = '[data-cy=constructor-container]'

describe('тестируем функциональность страницы конструктора бургера', () => {
    
  beforeEach(() => {
    cy.fixture('ingredients').then((mockIngredients) => {
      cy.intercept('GET', 'api/ingredients', {
        statusCode: 200,
        body: { success: true, data: mockIngredients }
      }).as('getIngredients');
      cy.intercept('POST', 'api/orders', {
        fixture: 'order.json'
      }).as('postOrder');
      cy.intercept('GET', 'api/auth/user', {
        fixture:'user.json'
      }).as('getUser')

      cy.visit(testUrl);
      cy.wait('@getIngredients');
    });


    window.localStorage.setItem('refreshToken', 'testRefreshToken');
    cy.setCookie('accessToken', 'testAcessToken')
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies(); 
  })

  it('сайт должен быть доступен по адресу http://localhost:4000', () => {
    cy.visit(testUrl);
  });

  it('добавление булок и ингредиентов в конструктор', () => {
    //Добавляем булку в конструктор
    cy.get(`[data-ing="ingredient-item-${'bun'}"]`).contains('Добавить').click();
    //Добавляем начинку в конструктор
    cy.get(`[data-ing="ingredient-item-${'main'}"]`).contains('Добавить').click();
    cy.get(`[data-ing="ingredient-item-${'sauce'}"]`).contains('Добавить').click();
  });

  it('тестируем открытие модального окна с нужным ингредиентом', () => {
    cy.get(`[data-cy="ingredient-item-${mockIngredientId}"]`).click();
    cy.get(modalSelector).should('be.visible')
  });

  it('тестируем закрытие модального окна по клику на кнопку', () => {
    const modal = cy.get(`[data-cy="ingredient-item-${mockIngredientId}"]`).click();

    modal.get(modalCloseButtonSelector).click();

    cy.get(modal).should('not.be.visible')  
  });

  it('тестируем закрытие модального окна по клику на оверлей', () => {
    const modal = cy.get(`[data-cy="ingredient-item-${mockIngredientId}"]`).click();

    cy.get('body').click(0,0)

    cy.get(modal).should('not.be.visible')  
  });

  it('тестируем процесс создания бургера', () => {
    // добавляем булки и ингредиенты в заказ
    cy.get(`[data-ing="ingredient-item-${'bun'}"]`).contains('Добавить').click();
    cy.get(`[data-ing="ingredient-item-${'main'}"]`).contains('Добавить').click();
    cy.get(`[data-ing="ingredient-item-${'sauce'}"]`).contains('Добавить').click();
    // нажимаем на кнопку 'оформить заказ'
    cy.get(`[data-cy='order-button']`).contains('Оформить заказ').click();
    // проверяем, что модальное окно открыто и, что оно содержит верный номер
    cy.get(modalSelector).contains(47808).should('exist');
    // закрываем модальное окно 
    cy.get(modalCloseButtonSelector).click()
    // проверяем, что конструктор очищен
    cy.get(emptyConstructor).contains('Выберите булки')
    cy.get(emptyConstructor).contains('Выберите начинку')
  })
});
