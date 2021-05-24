Vue.component("v-autocompleter", {
    template: `<div>\
    <div class='stripe-flex'>\
    <div class='inside'>\
        <img class='inputIcon visible' src='Grafiki/search.svg'/>\
        <input class='inputSearch' type='text' aria-label='Search' maxlength='2048'\
        ref="placeToFocus"\
        :value="value"\
        @input="$emit('input', $event.target.value)"\
         @focus='focused = true'  @keyup.down='down()' @keyup.up='up()'\
         @keyup.enter="$emit('enter')"/> \
        <div class='X'>\
        <img title='Wyczyść' class='inputIcon-clear' src='Grafiki/clear.svg' aria-label='Wyczyść'\
            role='button' />\
        <span class='line'></span>\
        </div>\
        <img title='Narzędzia do wprowadzania tekstu' class='inputIcon-keyboard'\
                                src='Grafiki/keyboard.svg' aria-label='Narzędzia do wprowadzania tekstu'\
                                role='button' />\
        <button id='SearchButton' type='submit' aria-label='Szukaj w Google'><img class='inputIcon'\
                                src='Grafiki/search_blue.svg' /></button>\
        </div>\
        <div class='cityNames' :class='{visible : value.length > 0 && focused && filteredCities.length>0}' >\
        <ul >\
            <li  v-for='(city,index) in filteredCities' >\
                <div class='listElement' :class='{liFocused:index == inFocus}'>\
                    <img class='inputIcon' src='Grafiki/search.svg' />\
                        <a href='#' v-html='boldenize(city)' v-on:click="selected(index); $emit('enter')" >\
                            <b>{{ city }}</b></a>\
                </div>\
            </li>\
        </ul>\
        </div>\
        </div>\
        </div>`,
    model: {
        event: 'enter'
    },
    props: {
        options:{
            type: Array
        },
          value: {
            type: String,
            default: ""
          }
        },
    data() {
        return {
           // value: '',
            filteredCities: "",
            update_filteredCities: true,
            focused: false,
            change: false,
            inFocus: -1,
            searchedInput: '',
        }
    },
    computed:{
        isActive() {
            if (this.value.length == 0) {
                this.change = false;
            }
            return this.change;

        }
     },
    watch: {
        // whenever question changes, this function will run
        inFocus: function () {
            this.update_filteredCities = false;
            this.value = this.filteredCities[this.inFocus].name;

        },
        value: function () {
            this.createFilteredCities(this.update_filteredCities);
            this.update_filteredCities = true;
            if (this.inFocus == -1) {
                this.searchedInput = this.value;

            }
            this.results();
        }
    },
    methods: {
        boldenize(city) {
            let re = new RegExp(this.searchedInput, "gi");
            let bolden = "<b>" + city.name.replace(re, match => {
                return "<span class='normal'>" + match + "</span>";
            }) + "</b>";

            return bolden;
        },
        enterClicked() {
            this.update_filteredCities = true;
            this.change = true;
            this.inFocus = -1;
            this.focused = false;
            this.results();
            return this.value
        },
        selected(i) {
            this.value = this.filteredCities[i].name;
        },
        
        down() {
            if (this.inFocus < this.filteredCities.length - 1) {
                this.inFocus += 1;
            }
            else if (this.inFocus == this.filteredCities.length - 1) {
                this.inFocus = 0;
            }
        },
        up() {
            if (this.inFocus > 0) {
                this.inFocus -= 1;
            }
            else if (this.inFocus == 0) {
                this.inFocus = this.filteredCities.length - 1;
            }
        },
        createFilteredCities(yes) {
            if (yes) {
                let result = this.options.filter(city => city.name.includes(this.value));
                if (result.length > 10) {
                    this.filteredCities = result.slice(1, 11);
                }
                else {
                    this.filteredCities = result;
                }
                this.inFocus = -1;
            }
        },
        results() {
           
            if (this.isActive) {
                document.getElementById("app").classList.add('results');

            }
            else if(  document.getElementById("app").classList.contains('results')){
                document.getElementById("app").classList.remove('results');

            }

        }

    }
})