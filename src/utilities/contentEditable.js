//Select all input value
export const selectAllInlineText = (e) => {
    e.target.focus();
    e.target.select();
}

//Onkeydown
export const saveColumnTitle = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        e.target.blur();
    }
}