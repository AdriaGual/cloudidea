<template>
  <q-layout class="flex column q-pt-lg bgGlobal">
    <div class="row">
      <div :class="$q.platform.is.desktop?'col-1 q-pl-md':'col-1 q-pl-sm'">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/faq')"/>
      </div>
      <div class="col text-center">
        <p class="poppinsBold q-pt-sm">General Rules
          <q-icon name="rule" class="q-pl-sm" size="sm"/>
        </p>
      </div>
      <div v-if="$q.platform.is.desktop" class="col-1"></div>
    </div>

    <div class="row">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col q-mt-sm"
           style="border-radius: 0.5em">
        <q-list bordered class="rounded-borders q-mb-sm q-mx-lg bg-white"
                v-for="(generalRule, key) in generalRulesItems"
                :key="key">

          <q-expansion-item
            expand-separator
            :icon="generalRule.icon"
            :label="generalRule.titleText"
            style="white-space: pre-line"
          >
            <q-card>
              <q-card-section class="q-mb-lg">
                {{generalRule.generalText}}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    </div>

  </q-layout>
</template>

<script>
  export default {
    data() {
      return {
        generalRulesItems: [{
          titleText: '1. Cuenta y contraseña',
          icon: 'o_account_circle',
          generalText: 'Si quieres abrir una cuenta, solicitamos que nos proporciones cierta información: tu nombre y una contraseña.\n Aceptas ser el único responsable del mantenimiento de tu cuenta.De permitir a otras personas usar tu cuenta, se consciente que deberás ser responable de todas las actividades que se produzcan con tu nombre y contraseña.\n Para tu seguridad, te aconsejamos que actualizes tu contraseña con cierta frecuéncia. Ten en cuenta que el contenido de este portal no puede ser vendido ni alquilado a nadie. Cloudidea se reserva todos los derechos y medidas legales para evitar el uso no autorizado de sus servicios.'
        }, {
          titleText: '2. Usuarios',
          icon: 'o_people',
          generalText: 'El acceso y/o uso de este portal de Cloudidea atribuye la condición de USUARIO, que acepta las Condiciones Generales de Uso aquí reflejadas.'
        }, {
          titleText: '3. Uso del portal',
          icon: 'personal_video',
          generalText: 'Cloudidea da acceso a multitud de información, servicios, programas o datos (en adelante, "los contenidos"). El usuario asume la responsabilidad del uso del portal, al registrar-se el usuario será responsable de aportar información veraz y lícita.\n El servicio de chat, comentarios... el usuario deberá cumplir con las normas aquío establecidas por Cloudidea que incluyen no incurrir en actividades ilícitas, ilegales; difundir contenidos o propaganda de carácter razista, xenófobo, pornográfico, de apologia al terrorismo o que atenten a los derechos humanos; Provocar daños en los sitemas físicos y lógicos de Cloudidea o de terceras personas, introducir o difundir en la red virus informáticos o cualquier otro sistema susceptible de provocar daños; Intentar acceder utilizando cuentas de correo electrónico de otros usuarios con el fin de modificar o manipular mensajes ajenos.\n\n Cloudidea se reserva el derecho de no publicar contenido que alteren las normas anteriormente mencionadas. En caso de comentarios que no se ajusten a la normativa establecida, la moderación de Cloudidea borrará, sin tener obligación de dar explicación aquellos que no cumplan con nuestras normas.\n Cloudidea no se hace responsable de las opiniones de los usuarios en chats privados u en otras herramientass de participación. '
        }, {
          titleText: '4. Protección de datos',
          icon: 'security',
          generalText: 'Cloudidea cumple con las directrices de la Ley Orgánica 15/1999 de 13 de diciembre de Protección de Datos de Carácter Personal, el Real Decreto 1720/2007 de 21 de diciembre por el que se aprueba el Reglamento de desarrollo de la Ley Orgánica y demás normativa vigente en cada momento, y vela por garantizar un correcto uso y tratamiento de los datos personales del usuario.'
        }, {
          titleText: '5. Propiedad intelectual e industrial',
          icon: 'history_edu',
          generalText: 'El usuario será el titular y tendrá los derechos de propiedad intelectual e industrial del contenido que muestre en la web: imagen, sonido, audio, video, codigo o textos.\n De acuerdo a los artículos 8 y 32.1 párrafo segundo, de la Ley de Propiedad Intelectual, queda expresamente prohibida la reproducción o distribución con fines comerciales sin autorización del autor intelectual o, en su defecto, la referéncia al mismo con motivación exclusiva de promocionar, sin fin lucrativo al usuario afectado. El usuario contemplará que la opción de descargar su contenido es por parte de Cloudidea siempre con el fin de beneficiar-le en sus objectivos.\n En el caso de no querer que su contenido sea descargado, siempre tendrá a su disposición la opción de eliminar-lo y, si lo desea, dar-se de baja de usuario.'
        }, {
          titleText: '6. Exclusión de garantías y responsabilidad',
          icon: 'o_class',
          generalText: 'Cloudidea no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.'
        }, {
          titleText: '7. Modificaciones',
          icon: 'o_create',
          generalText: 'Cloudidea se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados en su portal.'
        }, {
          titleText: '8. Enlaces',
          icon: 'link',
          generalText: 'En caso de que en Cloudidea se dispusiesen enlaces o hipervínculos hacía otros sitios de Internet, Cloudidea no ejercerá ningún tipo de control sobre dichos sitios y contenidos.En ningún caso Cloudidea asumirá responsabilidad alguna por los contenidos de algún enlace perteneciente a un sitio web ajeno, ni garantizará la disponibilidad técnica, calidad, fiabilidad, exactitud, amplitud, veracidad, validez y constitucionalidad de cualquier material o información contenida en ninguno de dichos hipervínculos u otros sitios de Internet.Igualmente la inclusión de estas conexiones externas no implicará ningún tipo de asociación, fusión o participación con las entidades conectadas.'
        }, {
          titleText: '9. Derecho de exclusión',
          icon: 'phonelink_erase',
          generalText: 'Cloudidea se reserva el derecho a denegar o retirar el acceso a portal y/o los servicios ofrecidos sin necesidad de preaviso, a instancia propia o de un tercero, a aquellos usuarios que incumplan las presentes Condiciones Generales de Uso.'
        }, {
          titleText: '10.Modificación de las presentes condiciones y duración',
          icon: 'receipt_long',
          generalText: 'Cloudidea podrá modificar en cualquier momento las condiciones aquí determinadas, siendo debidamente publicadas como aquí aparecen.'
        }
        ]
      }
    },
    methods: {
      goToPage(route) {
        this.$router.push(route)
      },
    },
  };
</script>
