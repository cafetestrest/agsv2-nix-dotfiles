import { sh } from 'lib/utils';

const fanRegister = 0x61;

export enum FanProfile {
	Silent = 1,
	Standart = 0,
	Performance = 2,
}

export const profileBinding = {
	1: 'battery',
	0: 'balanced',
	2: 'performance',
};

class PowerProfile extends Service {
	static {
		Service.register(
			this,
			{},
			{
				profile: ['int', 'r'],
			},
		);
	}

	#profile: FanProfile = FanProfile.Silent;

	async nextProfile() {
		this.#profile++;
		if (this.#profile > 2) this.#profile = 0;
		await sh(`sudo ec_probe write ${fanRegister} ${this.#profile}`);
		await sh(`sudo system76-power profile ${profileBinding[this.#profile]}`);
		this.changed('profile');
	}

	async prevProfile() {
		this.#profile--;
		if (this.#profile < 0) this.#profile = 2;
		await sh(`sudo ec_probe write ${fanRegister} ${this.#profile}`);
		await sh(`sudo system76-power profile ${profileBinding[this.#profile]}`);
		this.changed('profile');
	}

	async setProfile(prof: FanProfile) {
		await sh(`sudo ec_probe write ${fanRegister} ${prof}`);
		await sh(`sudo system76-power profile ${profileBinding[prof]}`);
		this.#profile = prof;
		this.changed('profile');
	}

	get profile() {
		return this.#profile;
	}

	get profiles(): FanProfile[] {
		return [1, 0, 2];
	}

	constructor() {
		super();

		sh(`sudo ec_probe read ${fanRegister}`).then((p) => {
			this.#profile = parseInt(p.split(' ')[0]) as FanProfile;
			sh(`sudo system76-power profile ${profileBinding[this.#profile]}`);
		});
	}
}

export default new PowerProfile();
