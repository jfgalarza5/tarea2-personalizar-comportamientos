import { LitElement, html, css } from "lit";

export class EspeUserProfile extends LitElement {
    static get properties() {
        return {
            nombre: {type: String},
            correo: {type: String},
            foto: {type: String},
            editando: {type: Boolean},
            mensajeError: {type: String},
            color1: {type: String},
            color2: {type: String},
            color3: {type: String},
            color4: {type: String},
            color5: {type: String},
        };
    }
    constructor() {
        super();
        this.nombre = this.correo = this.foto = this.mensajeError = "";
        this.editando = false;
        this.color1 = "#006935";
        this.color2 = "#E63329";
        this.color3 = "#FFE700";
        this.color4 = "#A05C00";
        this.color5 = "#892301";
    }
    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
                align-items: center;
                font-family: Arial, sans-serif;
                background: #fff;
                padding: 20px;
                border-radius: 12px;
                width: 320px;
                border: 3px solid var(--color1, #006935);
            }

            img {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 3px solid var(--color2, #E63329);
                margin-bottom: 12px;
                transition: transform 0.3s ease;
            }

            img:hover {
                transform: scale(1.05);
            }

            p {
                margin: 6px 0;
                font-size: 16px;
                color: var(--color1, #006935);
            }

            input {
                margin: 6px 0;
                padding: 8px;
                width: 100%;
                border: 2px solid var(--color4, #A05C00);
                border-radius: 6px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.3s ease;
            }

            input:focus {
                border-color: var(--color1, #006935);
            }

            button {
                background: var(--color1, #006935);
                color: white;
                border: none;
                padding: 10px 14px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                transition: background 0.3s ease, transform 0.2s ease;
                margin-top: 10px;
            }

            button:hover {
                background: var(--color5, #892301);
                transform: scale(1.05);
            }

            .error {
                margin-top: 8px;
                color: var(--color2, #E63329);
                font-size: 14px;
                text-align: center;
            }
        `;
    }
    updated() {
        this.style.setProperty('--color1', this.color1);
        this.style.setProperty('--color2', this.color2);
        this.style.setProperty('--color3', this.color3);
        this.style.setProperty('--color4', this.color4);
        this.style.setProperty('--color5', this.color5);
    }
    correoValido(correo) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(correo);
    }
    guardar() {
        const inputs = this.shadowRoot.querySelectorAll("input");
        const nuevoNombre = inputs[0].value.trim();
        const nuevoCorreo = inputs[1].value.trim();
        const nuevaFoto = inputs[2].value.trim();

        if (!nuevoNombre || !nuevoCorreo || !nuevaFoto) {
            this.mensajeError = "Por favor, completa todos los campos.";
            return;
        }

        if (!this.correoValido(nuevoCorreo)) {
            this.mensajeError = "Correo inválido. Ingresa un correo válido.";
            return;
        }

        this.nombre = nuevoNombre;
        this.correo = nuevoCorreo;
        this.foto = nuevaFoto;
        this.editando = false;
        this.mensajeError = "";

        this.dispatchEvent(
            new CustomEvent("perfil-actualizado", {
                detail: {
                    nombre: this.nombre,
                    correo: this.correo,
                    foto: this.foto,
                },
                bubbles: true,
                composed: true,
            })
        );
    }
    toggleEdit() {
        this.editando = !this.editando;
        this.mensajeError = "";
        this.dispatchEvent(
            new CustomEvent("editar-perfil", {
                detail: { editando: this.editando },
                bubbles: true,
                composed: true,
            })
        );
    }
    render() {
        return html`
        <img src="${this.foto}"/>
        ${this.editando
            ? html`
                <input type="text" .value=${this.nombre} placeholder="Nombre" />
                <input type="email" .value=${this.correo} placeholder="Correo" />
                <input type="text" .value=${this.foto} placeholder="URL de la foto" />
                <button @click=${this.guardar}>Guardar</button>
                ${this.mensajeError
                    ? html`<div class="error">${this.mensajeError}</div>`
                    : ''
                }
            `
            : html`
                <p><strong>${this.nombre}</strong></p>
                <p>${this.correo}</p>
                <button @click=${this.toggleEdit}>Editar</button>
            `}
        `;
    }
}

customElements.define("espe-user-profile", EspeUserProfile);