/**
 * HUD captions of the 3D hero intros. Kept apart from the scene modules so the
 * first paint doesn't need three.js; the order must match the `mark(i, …)` calls
 * in pcScene.ts / phoneScene.ts.
 */
export type HeroScene = 'pc' | 'phone';

type Step = readonly [title: string, description: string];

export const HERO_STEPS: Record<HeroScene, readonly Step[]> = {
  pc: [
    ['Ambiente', 'Iluminação tecnológica em um ambiente escuro.'],
    ['Placa-mãe', 'A base do projeto surge no espaço 3D.'],
    ['Processador', 'Encaixe preciso no socket.'],
    ['Memória RAM', 'Módulos instalados nos slots DIMM.'],
    ['SSD NVMe', 'Armazenamento de alta velocidade na placa.'],
    ['Placa de vídeo', 'Encaixe no slot PCIe x16.'],
    ['Fonte de alimentação', 'Fonte modular posicionada na base.'],
    ['Refrigeração líquida', 'Bloco, radiador e mangueiras.'],
    ['Coolers e cabos', 'Ventoinhas instaladas e cabos organizados.'],
    ['Gabinete', 'Todo o conjunto assentado no chassi.'],
    ['Iluminação RGB', 'Ativação progressiva da iluminação.'],
    ['Sistema finalizado', 'Apresentação em 360 graus.'],
  ],
  phone: [
    ['Diagnóstico', 'Abrimos o aparelho e começamos pela causa real.'],
    ['Placa lógica', 'Leitura da placa antes de qualquer reparo.'],
    ['Bateria', 'Recupere a autonomia do seu aparelho.'],
    ['Flex e conectores', 'Conexões revisadas e firmes.'],
    ['Conector de carga', 'Diagnóstico e reparo de carregamento.'],
    ['Câmera', 'Módulos frontal e traseiro reparados.'],
    ['Alto-falante e microfone', 'Áudio e captação funcionando como novos.'],
    ['Parafusos e vedação', 'Fechamento preciso, parafuso por parafuso.'],
    ['Tela', 'Peças de qualidade e instalação precisa.'],
    ['Software e testes', 'Ajustes, otimização e verificação final.'],
    ['Funcionando como novo', 'Seu celular pronto para voltar com você.'],
  ],
};
