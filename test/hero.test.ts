import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('hero contract', () => {
  async function createHero() {
    const heroContract = await ethers.getContractFactory('TestHero');
    const deployedHeroContract = await heroContract.deploy();
    await deployedHeroContract.deployed();

    return deployedHeroContract;
  }

  let hero;

  before(async () => {
    hero = await createHero();
  });

  it('should get zero heroes array', async () => {
    expect(await hero.getHeroes()).to.deep.equal([]);
  });

  it('should fail at creating hero because of not enought money', async () => {
    let error;

    try {
      await hero.createHero(0, { value: ethers.utils.parseEther('0.04') });
    } catch (err) {
      error = err;
    }

    expect(error.message.includes('Not enough ethers')).to.equal(true);
  });

  it('should generate a random hero', async () => {
    await hero.setRandom(200);
    await hero.createHero(0, { value: ethers.utils.parseEther('0.05') });

    const mage = (await hero.getHeroes())[0];

    expect(await hero.getMagic(mage)).to.equal(14);
    expect(await hero.getStrength(mage)).to.equal(3);
    expect(await hero.getHealth(mage)).to.equal(5);
    expect(await hero.getDexterity(mage)).to.equal(9);
    expect(await hero.getIntellect(mage)).to.equal(6);
  });
});
