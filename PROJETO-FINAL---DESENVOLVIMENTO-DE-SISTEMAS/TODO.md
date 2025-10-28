# TODO List for Pizzaria App Updates

## 1. Fix Payment Method Overwriting Bug
- [x] Update BACKEND/src/services/Pagamento/MetodoPagamentoService.ts to prevent overwriting metodo if already set (not 0)

## 2. Create AssignTable Screen
- [x] Create MOBILE/src/pages/AssignTable/index.tsx (similar to OrderStatus for table assignment post-login)

## 3. Update Navigation After Login
- [x] Update MOBILE/src/pages/SignIn/index.tsx to navigate to AssignTable instead of CreateComanda

## 4. Update Navigation After Payment
- [x] Update MOBILE/src/pages/Pagamento/index.tsx to navigate to Orders after payment

## 5. Update Color Scheme
- [x] Update color scheme in stylesheets (change #911F09 to pastel tones)

## 6. Update Cart with Photos and Edit Button
- [x] Update MOBILE/src/pages/Cart/index.tsx to add product photos and edit button for ingredients

## 7. Create EditProductIngredients Screen
- [x] Create MOBILE/src/pages/EditProductIngredients/index.tsx for editing product ingredients

## 8. Testing
- [ ] Test payment fix
- [ ] Test navigation flows
- [ ] Test color changes
- [ ] Test cart edit functionality
